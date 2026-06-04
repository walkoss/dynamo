import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../../..");
const componentRoot = join(repoRoot, "components/kubectl-doc");
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

test("KubeSchemaDoc gates idle full-payload hydration on viewport visibility", () => {
  assert.match(schemaDoc, /const \[isVisible, setIsVisible\] = useState\(false\)/);
  assert.match(schemaDoc, /const dataGenerationRef = useRef\(0\)/);
  assert.match(schemaDoc, /new IntersectionObserver/);
  assert.match(schemaDoc, /rootMargin: "160px 0px"/);
  assert.match(schemaDoc, /activeData\.complete \|\| !isVisible \|\| \(!activeData\.fullPayloadURL && !onLoadFull\)/);
  assert.match(schemaDoc, /const generation = dataGenerationRef\.current;\s*fetch\(resolveSchemaSource\(activeData\.fullPayloadURL\)\)/s);
  assert.match(schemaDoc, /if \(generation === dataGenerationRef\.current\) \{\s*setLoadedData\(parseSchemaPayload\(payload\)\);/s);
  assert.match(schemaDoc, /const handle = idleCallback\(\(\) => loadFull\(\)\)/);
});

test("KubeSchemaDoc hydrates immediately for expand and filter", () => {
  assert.match(schemaDoc, /const \[hydratingFull, setHydratingFull\] = useState\(false\)/);
  assert.match(schemaDoc, /if \(activeData\.complete\) \{\s*setHydratingFull\(false\);/s);
  assert.match(schemaDoc, /if \(onLoadFull\) \{\s*setHydratingFull\(onLoadFull\(\) !== false\);/s);
  assert.match(schemaDoc, /if \(!activeData\.fullPayloadURL\) \{\s*setHydratingFull\(false\);/s);
  assert.match(schemaDoc, /if \(loadingFullRef\.current\) \{\s*setHydratingFull\(true\);/s);
  assert.match(schemaDoc, /setHydratingFull\(false\);\s*console\.error\("kubectl-doc schema failed to load", loadError\);/s);
  assert.match(schemaDoc, /className="kdoc-fern-filter-loading">loading full schema/);
  assert.match(schemaDoc, /if \(!activeData\.complete && !lineExpanded\(line, expanded\)\) \{\s*loadFull\(\);/s);
  assert.match(schemaDoc, /if \(current\?\.foldable && !lineExpanded\(current, expanded\)\) \{\s*if \(!activeData\.complete\) \{\s*loadFull\(\);/s);
  assert.match(schemaDoc, /if \(filtering && event\.key\.length === 1 && event\.key !== "\/" && !event\.shiftKey\) \{\s*if \(!activeData\.complete\) \{\s*loadFull\(\);/s);
});

test("KubeSchemaDoc preserves user fold and focus state across full-payload hydration", () => {
  assert.match(schemaDoc, /setExpanded\(\(current\) => \(\{ \.\.\.initialExpanded\(activeData\.lines\), \.\.\.current \}\)\)/);
  assert.match(schemaDoc, /setFocusedId\(firstFocusableLine\(activeData\.lines\)\?\.detailId \?\? ""\)/);
  assert.match(schemaDoc, /if \(!focusableLines\.some\(\(line\) => line\.detailId === focusedId\)\)/);
  assert.match(schemaDoc, /scrollIntoView\(\{ block: "nearest", inline: "nearest" \}\)/);
});

test("KubeSchemaDoc filtering uses structured field details instead of duplicated line indexes", () => {
  assert.doesNotMatch(schemaDoc, /description\?: string;\n\s+depth:/);
  assert.doesNotMatch(schemaDoc, /filterText\?: string/);
  assert.match(schemaDoc, /const field = line\.detailId \? fieldsById\.get\(line\.detailId\) : undefined/);
  assert.match(schemaDoc, /const text = `\$\{line\.field \?\? ""\}\\n\$\{line\.path \?\? ""\}\\n\$\{field\?\.description \?\? ""\}`\.toLowerCase\(\)/);
});

test("KubeSchemaDoc foldable tab navigation uses line identity, not shared field details", () => {
  assert.match(schemaDoc, /function previousFoldable[\s\S]*findIndex\(\(line\) => line\.index === current\.index\)/);
  assert.match(schemaDoc, /function nextFoldable[\s\S]*findIndex\(\(line\) => line\.index === current\.index\)/);
  assert.doesNotMatch(schemaDoc, /function previousFoldable[\s\S]*findIndex\(\(line\) => line\.detailId === current\.detailId\)/);
  assert.doesNotMatch(schemaDoc, /function nextFoldable[\s\S]*findIndex\(\(line\) => line\.detailId === current\.detailId\)/);
});

test("LazyKubeSchemaDoc delegates idle hydration to KubeSchemaDoc", () => {
  assert.match(lazySchemaDoc, /const rootRef = useRef<HTMLDivElement>\(null\)/);
  assert.match(lazySchemaDoc, /const \[isVisible, setIsVisible\] = useState\(false\)/);
  assert.match(lazySchemaDoc, /const schemaGenerationRef = useRef\(0\)/);
  assert.match(lazySchemaDoc, /const loadingInitialRef = useRef\(false\)/);
  assert.match(lazySchemaDoc, /new IntersectionObserver/);
  assert.match(lazySchemaDoc, /rootMargin: "160px 0px"/);
  assert.match(lazySchemaDoc, /if \(!isVisible \|\| data \|\| loadingInitialRef\.current\) \{/);
  assert.match(lazySchemaDoc, /schemaGenerationRef\.current \+= 1;/);
  assert.match(lazySchemaDoc, /const generation = schemaGenerationRef\.current;\s*fetch\(resolveSchemaSource\(source\.initial\)\)/s);
  assert.match(lazySchemaDoc, /if \(!cancelled && generation === schemaGenerationRef\.current\) \{\s*setData\(parseSchemaPayload\(payload\)\);/s);
  assert.match(lazySchemaDoc, /const generation = schemaGenerationRef\.current;\s*fetch\(resolveSchemaSource\(source\)\)/s);
  assert.match(lazySchemaDoc, /if \(generation === schemaGenerationRef\.current\) \{\s*setData\(parseSchemaPayload\(payload\)\);/s);
  assert.match(lazySchemaDoc, /if \(!source \|\| data\?\.complete\) \{\s*return false;/s);
  assert.match(lazySchemaDoc, /if \(loadingFullRef\.current\) \{\s*return true;/s);
  assert.match(lazySchemaDoc, /return true;\s*}, \[data\?\.complete, name\]\);/s);
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
  assert.match(
    schemaDoc,
    /\.kdoc-fern-tree\{[^}]*contain:inline-size[^}]*inline-size:100%[^}]*max-inline-size:100%[^}]*overflow:hidden/,
  );
  assert.match(
    schemaDoc,
    /\.kdoc-fern-line\{[^}]*contain:inline-size[^}]*display:grid[^}]*grid-template-columns:24px minmax\(0,1fr\)[^}]*inline-size:100%[^}]*overflow:hidden[^}]*white-space:normal/,
  );
  assert.match(
    schemaDoc,
    /\.kdoc-fern \.kdoc-fern-yaml\{[^}]*display:block[^}]*inline-size:100%[^}]*max-inline-size:100%[^}]*min-inline-size:0[^}]*overflow-wrap:anywhere!important[^}]*overflow-x:hidden[^}]*white-space:pre-wrap/,
  );
  assert.match(
    schemaDoc,
    /\.kdoc-fern \.kdoc-fern-yaml \*\{[^}]*max-inline-size:100%[^}]*min-inline-size:0[^}]*overflow-wrap:anywhere!important[^}]*word-break:break-word/,
  );
});

test("KubeSchemaDoc keeps field details as a focused high-z overlay", () => {
  assert.match(schemaDoc, /const showDetails = Boolean\(hasFocus && focusedField\)/);
  assert.match(schemaDoc, /const treeRect = treeRef\.current\.getBoundingClientRect\(\)/);
  assert.match(schemaDoc, /const top = Math\.max\(treeRect\.top, headerHeight \+ gap\)/);
  assert.match(schemaDoc, /const bottom = Math\.min\(treeRect\.bottom, window\.innerHeight - gap\)/);
  assert.match(schemaDoc, /const left = Math\.min\(Math\.max\(treeRect\.right \+ gap, gap\), window\.innerWidth - width - gap\)/);
  assert.match(schemaDoc, /visibility: maxHeight >= 120 \? "visible" : "hidden"/);
  assert.match(schemaDoc, /\.kdoc-fern\{[^}]*position:relative[^}]*z-index:2147483000/);
  assert.match(schemaDoc, /\.kdoc-fern-details\{[^}]*position:sticky[^}]*z-index:2147483647/);
  assert.match(schemaDoc, /@media\(min-width:1200px\)\{\.kdoc-fern-details\{[^}]*position:fixed/);
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
    assert.ok(initial.payload.lines.length < full.payload.lines.length, `${file} should have fewer lines than ${fullFile}`);
    assert.ok(initial.payload.fields.length < full.payload.fields.length, `${file} should have fewer fields than ${fullFile}`);
    if (full.content.length > 1_000_000) {
      assert.ok(
        initial.content.length * 4 < full.content.length,
        `${file} should keep large initial payloads materially smaller than ${fullFile}: initial=${initial.content.length} full=${full.content.length}`,
      );
    }

    const metadata = initial.payload.lines.find((line) => line.path === "metadata");
    assert.ok(metadata?.collapsed, `${file} should keep metadata collapsed in the initial payload`);
    assert.ok(
      initial.payload.lines.some((line) => line.foldable && line.collapsed),
      `${file} should retain collapsed placeholders for hidden descendants`,
    );

    for (const line of [...initial.payload.lines, ...full.payload.lines]) {
      assert.equal(line.description, undefined, `${file}/${fullFile} should not duplicate descriptions in line records`);
      assert.equal(line.filterText, undefined, `${file}/${fullFile} should not duplicate filter text in line records`);
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
