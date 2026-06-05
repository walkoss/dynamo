import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../../..");
const componentRoot = here;
const schemaDoc = readFileSync(join(componentRoot, "KubeSchemaDoc.tsx"), "utf8");
const lazySchemaDoc = readFileSync(join(componentRoot, "LazyKubeSchemaDoc.tsx"), "utf8");

function readSchemaPayload(fileName) {
  const content = readFileSync(join(repoRoot, "docs/kubernetes/api-reference/schemas", fileName), "utf8");
  const match = content.match(/```kubectl-doc-schema\s*([\s\S]*?)\s*```/);
  assert.ok(match, `${fileName} should contain a kubectl-doc-schema payload`);
  return {
    content,
    payload: JSON.parse(Buffer.from(match[1].replace(/\s+/g, ""), "base64").toString("utf8")),
  };
}

function lazySchemaSources() {
  const sources = new Map();
  const sourcePattern = /"([^"]+)": \{ initial: "\.\/([^"]+)", full: "\.\/([^"]+)" \}/g;
  let match;
  while ((match = sourcePattern.exec(lazySchemaDoc)) !== null) {
    sources.set(match[1], { initial: match[2], full: match[3] });
  }
  return sources;
}

function slugName(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([A-Za-z])([0-9])/g, "$1-$2")
    .toLowerCase();
}

test("KubeSchemaDoc consumes the shared kubectl-doc runtime instead of rendering schema lines in React", () => {
  assert.match(schemaDoc, /import \{ kubectlDocStyles \} from "\.\/kubectl-doc-styles";/);
  assert.match(schemaDoc, /const styleElementID = "kubectl-doc-fern-styles";/);
  assert.match(schemaDoc, /function ensureKubectlDocStyles\(\)/);
  assert.match(schemaDoc, /style\.textContent = kubectlDocStyles;/);
  assert.match(schemaDoc, /import\("\.\/kubectl-doc-runtime\.js"\)/);
  assert.match(schemaDoc, /runtime\.mount\(rootRef\.current, \{/);
  assert.match(schemaDoc, /initialSchema: data/);
  assert.match(schemaDoc, /detailsMode: "side-overlay"/);
  assert.match(schemaDoc, /wrapControl: false/);
  assert.match(schemaDoc, /wrapComments: true/);
  assert.match(schemaDoc, /loadFullSchema: loadFullSchema \?\? onLoadFull \?\? defaultLoadFullSchema\(data\)/);
  assert.match(schemaDoc, /controller\?\.destroy\(\);/);
  assert.doesNotMatch(schemaDoc, /useState/);
  assert.doesNotMatch(schemaDoc, /visibleLines\.map/);
  assert.doesNotMatch(schemaDoc, /data\.lines\.map/);
  assert.doesNotMatch(schemaDoc, /<SchemaLine/);
  assert.doesNotMatch(schemaDoc, /function SchemaLine/);
});

test("shared runtime keeps Fern overlay, scoped keyboard, and lazy full-payload state behavior", () => {
  const runtime = readFileSync(join(componentRoot, "kubectl-doc-runtime.js"), "utf8");
  const css = readFileSync(join(componentRoot, "kubectl-doc-styles.ts"), "utf8");

  assert.match(runtime, /function mount\(root, options\)/);
  assert.match(runtime, /renderSchema\(root, options\.initialSchema, options\);/);
  assert.match(runtime, /root\.classList\.toggle\("kdoc-details-side-overlay", scopedKeyboard\);/);
  assert.match(runtime, /var keyTarget = scopedKeyboard \? root : document;/);
  assert.match(runtime, /keyTarget\.addEventListener\("keydown", handleCursorKey\);/);
  assert.match(runtime, /var currentFilter = filterQuery;/);
  assert.match(runtime, /function renderPayloadToken\(token\)/);
  assert.match(runtime, /if\(line\.tokens && line\.tokens\.length\)\{/);
  assert.doesNotMatch(runtime, /function renderInlineYAML/);
  assert.doesNotMatch(runtime, /function renderYAMLCode/);
  assert.doesNotMatch(runtime, /function renderScalarToken/);
  assert.match(runtime, /function wantsFullSchemaForExpansion\(line\)/);
  assert.match(runtime, /function expandWithFullSchema\(line\)/);
  assert.match(runtime, /function toggleExpandedWithFullSchema\(line\)/);
  assert.match(runtime, /foldStates\.push\(\{path: state\.path, expanded: expanded\(state\.line\)\}\);/);
  assert.match(runtime, /root\.innerHTML = "";/);
  assert.match(runtime, /if\(currentFilter && nextController && nextController\.setFilter\)\{ nextController\.setFilter\(currentFilter\); \}/);
  assert.match(runtime, /if\(currentPath && nextController && nextController\.focusPath\)\{ nextController\.focusPath\(currentPath, \{scroll:false\}\); \}/);

  assert.match(css, /\.kdoc-fern-host\{/);
  assert.match(css, /\.kdoc-fern-host \.kdoc-tree\{[^}]*overflow:hidden/);
  assert.match(css, /\.kdoc-fern-host\.kdoc-details-side-overlay:not\(\.kdoc-has-focus\) \.kdoc-details\{display:none\}/);
  assert.match(css, /\.kdoc-fern-host\.kdoc-details-side-overlay \.kdoc-details\{[^}]*position:fixed[^}]*z-index:2147483647/);
});

test("LazyKubeSchemaDoc delegates idle hydration to KubeSchemaDoc", () => {
  assert.match(lazySchemaDoc, /const rootRef = useRef<HTMLDivElement>\(null\)/);
  assert.match(lazySchemaDoc, /const \[isVisible, setIsVisible\] = useState\(false\)/);
  assert.match(lazySchemaDoc, /const schemaGenerationRef = useRef\(0\)/);
  assert.match(lazySchemaDoc, /const loadingInitialRef = useRef\(false\)/);
  assert.match(lazySchemaDoc, /const fullLoadRef = useRef<Promise<KubeSchemaDocument> \| null>\(null\)/);
  assert.match(lazySchemaDoc, /new IntersectionObserver/);
  assert.match(lazySchemaDoc, /rootMargin: "160px 0px"/);
  assert.match(lazySchemaDoc, /if \(!isVisible \|\| data \|\| loadingInitialRef\.current\) \{/);
  assert.match(lazySchemaDoc, /schemaGenerationRef\.current \+= 1;/);
  assert.match(lazySchemaDoc, /const generation = schemaGenerationRef\.current;\s*fetch\(resolveSchemaSource\(source\.initial\)\)/s);
  assert.match(lazySchemaDoc, /if \(!cancelled && generation === schemaGenerationRef\.current\) \{\s*setData\(parseSchemaPayload\(payload\)\);/s);
  assert.match(lazySchemaDoc, /if \(fullLoadRef\.current\) \{\s*return fullLoadRef\.current;/s);
  assert.match(lazySchemaDoc, /const generation = schemaGenerationRef\.current;\s*const promise = fetch\(resolveSchemaSource\(source\)\)/s);
  assert.match(lazySchemaDoc, /const next = parseSchemaPayload\(payload\);\s*if \(generation !== schemaGenerationRef\.current\) \{/s);
  assert.match(lazySchemaDoc, /setData\(next\);\s*return next;/s);
  assert.match(lazySchemaDoc, /fullLoadRef\.current = promise;\s*return promise;/s);
  assert.match(lazySchemaDoc, /if \(!source \|\| data\?\.complete\) \{\s*return false;/s);
  assert.doesNotMatch(lazySchemaDoc, /return true;/);
  assert.match(lazySchemaDoc, /<div ref=\{rootRef\} className="kdoc-fern-lazy-frame">/);
  assert.doesNotMatch(lazySchemaDoc, /requestIdleCallback/);
  assert.doesNotMatch(lazySchemaDoc, /setTimeout\(callback, 1500\)/);
  assert.match(lazySchemaDoc, /<KubeSchemaDoc data=\{data\} filtering=\{filtering\} onLoadFull=\{loadFull\} \/>/);
  assert.match(lazySchemaDoc, /export default LazyKubeSchemaDoc;/);

  const resetIndex = lazySchemaDoc.indexOf("useEffect(() => {\n    schemaGenerationRef.current += 1;\n    setData(null);");
  const resetEnd = lazySchemaDoc.indexOf("  }, [name]);", resetIndex);
  const visibilityFetchIndex = lazySchemaDoc.indexOf("if (!isVisible || data || loadingInitialRef.current)");
  assert.ok(resetIndex >= 0, "LazyKubeSchemaDoc should reset loaded data only in a schema-name effect");
  assert.ok(resetEnd > resetIndex, "LazyKubeSchemaDoc reset effect should depend only on name");
  assert.ok(
    resetEnd < visibilityFetchIndex,
    "LazyKubeSchemaDoc must not clear already-loaded data when visibility changes",
  );
});

test("KubeSchemaDoc keeps long YAML/comment lines inside the schema frame", () => {
  const css = readFileSync(join(componentRoot, "kubectl-doc-styles.ts"), "utf8");
  assert.match(css, /\.kdoc-fern-host \.kdoc-tree\{[^}]*inline-size:100%[^}]*max-inline-size:100%[^}]*overflow:hidden/);
  assert.match(css, /\.kdoc-fern-host \.kdoc-line\{[^}]*display:grid[^}]*grid-template-columns:24px minmax\(0,1fr\)[^}]*inline-size:100%[^}]*max-inline-size:100%[^}]*overflow:hidden[^}]*white-space:normal/);
  assert.match(css, /\.kdoc-fern-host \.kdoc-line\[hidden\]\{display:none!important\}/);
  assert.match(css, /\.kdoc-fern-host \.kdoc-yaml-text\{[^}]*display:block[^}]*min-inline-size:0[^}]*overflow-wrap:anywhere[^}]*white-space:pre-wrap/);
  assert.match(css, /\.kdoc-fern-host \.kdoc-yaml-text \*\{[^}]*max-inline-size:100%[^}]*min-inline-size:0[^}]*overflow-wrap:anywhere/);
});

test("KubeSchemaDoc keeps field details as a focused high-z overlay", () => {
  const runtime = readFileSync(join(componentRoot, "kubectl-doc-runtime.js"), "utf8");
  const css = readFileSync(join(componentRoot, "kubectl-doc-styles.ts"), "utf8");
  assert.match(runtime, /root\.classList\.add\("kdoc-has-focus"\)/);
  assert.match(runtime, /root\.classList\.remove\("kdoc-has-focus"\)/);
  assert.match(css, /\.kdoc-fern-host\{[^}]*position:relative[^}]*z-index:2147483000/);
  assert.match(css, /\.kdoc-fern-host\.kdoc-details-side-overlay:not\(\.kdoc-has-focus\) \.kdoc-details\{display:none\}/);
  assert.match(css, /\.kdoc-fern-host\.kdoc-details-side-overlay \.kdoc-details\{[^}]*position:fixed[^}]*z-index:2147483647/);
});

test("multi-version API reference pages keep inactive versions behind Fern tabs", () => {
  const pages = [
    "dynamocomponentdeployment.mdx",
    "dynamographdeployment.mdx",
    "dynamographdeploymentrequest.mdx",
    "dynamographdeploymentscalingadapter.mdx",
  ];

  for (const page of pages) {
    const content = readFileSync(join(repoRoot, "docs/kubernetes/api-reference", page), "utf8");
    assert.match(content, /<Tabs>/, `${page} should render versions in tabs`);
    assert.match(content, /<Tab title="nvidia\.com\/v1beta1">/, `${page} should have a v1beta1 tab`);
    assert.match(content, /<Tab title="nvidia\.com\/v1alpha1">/, `${page} should have a v1alpha1 tab`);
    assert.doesNotMatch(content, /^## nvidia\.com\//m, `${page} should not mount versions as plain headings`);
  }
});

test("schema pages do not wrap the primary tree in a YAML disclosure", () => {
  assert.doesNotMatch(schemaDoc, /className="kdoc-fern-title"/);
  assert.doesNotMatch(schemaDoc, />YAML</);
  assert.doesNotMatch(schemaDoc, /<Accordion[^>]*YAML/);

  for (const page of readdirSync(join(repoRoot, "docs/kubernetes/api-reference")).filter((file) => file.endsWith(".mdx"))) {
    const content = readFileSync(join(repoRoot, "docs/kubernetes/api-reference", page), "utf8");
    assert.doesNotMatch(content, /<Accordion[^>]*YAML/, `${page} should not wrap the schema in a Fern accordion`);
    assert.doesNotMatch(content, /<details[\s\S]*?<summary>YAML/, `${page} should not wrap the schema in a details block`);
  }
});

test("generated schema payload pages keep shallow and full data split", () => {
  const schemaDir = join(repoRoot, "docs/kubernetes/api-reference/schemas");
  const files = readdirSync(schemaDir).filter((file) => file.endsWith(".md")).sort();
  const initialFiles = files.filter((file) => !file.endsWith("Full.md"));

  assert.ok(initialFiles.length > 0, "expected generated initial schema payload pages");
  for (const file of initialFiles) {
    const fullFile = file.replace(/\.md$/, "Full.md");
    assert.ok(files.includes(fullFile), `${file} should have a matching full payload page`);

    const initial = readSchemaPayload(file);
    const full = readSchemaPayload(fullFile);
    assert.equal(initial.payload.complete, false, `${file} should be an initial shallow payload`);
    assert.equal(full.payload.complete, true, `${fullFile} should be a complete payload`);
    assert.ok(initial.payload.lines.length <= full.payload.lines.length, `${file} should not have more lines than ${fullFile}`);
    assert.ok(initial.payload.fields.length <= full.payload.fields.length, `${file} should not have more fields than ${fullFile}`);
    if (full.content.length > 1_000_000) {
      assert.ok(
        initial.content.length * 4 < full.content.length,
        `${file} should keep large initial payloads materially smaller than ${fullFile}: initial=${initial.content.length} full=${full.content.length}`,
      );
    }

    const metadata = initial.payload.lines.find((line) => line.path === "metadata");
    assert.ok(metadata?.collapsed, `${file} should keep metadata collapsed in the initial payload`);
    assert.ok(
      initial.payload.lines.some((line) => line.path === "metadata.name"),
      `${file} should include metadata.name before loading the full payload`,
    );
    assert.ok(
      initial.payload.lines.some((line) => line.path === "metadata.namespace"),
      `${file} should include metadata.namespace before loading the full payload`,
    );
    assert.equal(
      initial.payload.lines.some((line) => line.path === "status.phase"),
      false,
      `${file} should keep status descendants out of the initial payload`,
    );
    assert.ok(
      initial.payload.lines.some((line) => line.foldable && line.collapsed),
      `${file} should retain collapsed placeholders for hidden descendants`,
    );

    for (const line of [...initial.payload.lines, ...full.payload.lines]) {
      assert.equal(line.description, undefined, `${file}/${fullFile} should not duplicate descriptions in line records`);
      assert.equal(line.filterText, undefined, `${file}/${fullFile} should not duplicate filter text in line records`);
      assert.equal(line.text, undefined, `${file}/${fullFile} should not duplicate raw YAML text in line records`);
      assert.ok(line.comment || Array.isArray(line.tokens), `${file}/${fullFile} should carry structured line tokens`);
    }
    for (const content of [initial.content, full.content]) {
      const lower = content.toLowerCase();
      assert.equal(lower.includes("localhost"), false, `${file}/${fullFile} should not reference localhost`);
      assert.equal(lower.includes("/openapi"), false, `${file}/${fullFile} should not reference live OpenAPI`);
      assert.equal(lower.includes("openapi/v2"), false, `${file}/${fullFile} should not reference OpenAPI v2`);
      assert.equal(lower.includes("openapi/v3"), false, `${file}/${fullFile} should not reference OpenAPI v3`);
    }
  }
});

test("DynamoGraphDeployment keeps a small initial schema payload", () => {
  for (const index of [0, 1]) {
    const initial = readSchemaPayload(`DynamoGraphDeploymentSchema${index}.md`);
    const full = readSchemaPayload(`DynamoGraphDeploymentSchema${index}Full.md`);
    assert.equal(initial.payload.complete, false, `v${index} initial payload should be shallow`);
    assert.equal(full.payload.complete, true, `v${index} full payload should be complete`);
    assert.ok(
      initial.content.length < 150_000,
      `v${index} initial payload should remain below 150KB, got ${initial.content.length}`,
    );
    assert.ok(
      full.content.length > 3_000_000,
      `v${index} full payload should keep the complete generated schema, got ${full.content.length}`,
    );
    assert.ok(
      initial.content.length * 20 < full.content.length,
      `v${index} initial payload should be at least 20x smaller than full payload: initial=${initial.content.length} full=${full.content.length}`,
    );
  }
});

test("API reference pages, lazy source map, and hidden routes stay in sync", () => {
  const apiReferenceDir = join(repoRoot, "docs/kubernetes/api-reference");
  const schemaDir = join(apiReferenceDir, "schemas");
  const docsIndex = readFileSync(join(repoRoot, "docs/index.yml"), "utf8");
  const sources = lazySchemaSources();
  const usedNames = new Set();

  for (const page of readdirSync(apiReferenceDir).filter((file) => file.endsWith(".mdx")).sort()) {
    const content = readFileSync(join(apiReferenceDir, page), "utf8");
    for (const match of content.matchAll(/<LazyKubeSchemaDoc name=\{"([^"]+)"\} \/>/g)) {
      usedNames.add(match[1]);
    }
  }
  assert.ok(usedNames.size > 0, "expected API reference pages to use LazyKubeSchemaDoc");

  for (const name of usedNames) {
    const source = sources.get(name);
    assert.ok(source, `${name} should have a LazyKubeSchemaDoc source mapping`);

    const initialFile = `${name}.md`;
    const fullFile = `${name}Full.md`;
    assert.ok(readdirSync(schemaDir).includes(initialFile), `${name} should have ${initialFile}`);
    assert.ok(readdirSync(schemaDir).includes(fullFile), `${name} should have ${fullFile}`);
    assert.match(
      docsIndex,
      new RegExp(`path: kubernetes/api-reference/schemas/${initialFile}`),
      `${initialFile} should be listed as a hidden Fern page`,
    );
    assert.match(
      docsIndex,
      new RegExp(`path: kubernetes/api-reference/schemas/${fullFile}`),
      `${fullFile} should be listed as a hidden Fern page`,
    );

    const slug = slugName(name);
    assert.equal(source.initial, `${slug}.md`, `${name} initial source should match hidden route slug markdown URL`);
    assert.equal(source.full, `${slug}-full.md`, `${name} full source should match hidden route slug markdown URL`);
    assert.match(docsIndex, new RegExp(`slug: ${slug}`), `${name} initial slug should exist in docs index`);
    assert.match(docsIndex, new RegExp(`slug: ${slug}-full`), `${name} full slug should exist in docs index`);
  }

  for (const name of sources.keys()) {
    assert.ok(usedNames.has(name), `${name} source mapping should be used by an API reference page`);
  }
});
