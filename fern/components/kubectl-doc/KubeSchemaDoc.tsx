"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

type KubeSchemaLine = {
  index: number;
  text: string;
  description?: string;
  depth: number;
  field?: string;
  path?: string;
  code?: boolean;
  metadata?: boolean;
  required?: boolean;
  foldable?: boolean;
  collapsed?: boolean;
  detailId?: string;
  filterText?: string;
};

type KubeSchemaField = {
  id: string;
  path: string;
  type: string;
  required: boolean;
  description?: string;
  metadata?: string[];
};

type KubeSchemaDocument = {
  apiVersion: string;
  group: string;
  version: string;
  kind: string;
  resource?: string;
  lines: KubeSchemaLine[];
  fields: KubeSchemaField[];
};

type KubeSchemaDocProps = {
  data: KubeSchemaDocument;
  filtering?: boolean;
};

export function KubeSchemaDoc({ data, filtering = true }: KubeSchemaDocProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>(() => initialExpanded(data.lines));
  const [focusedId, setFocusedId] = useState(() => firstFocusableLine(data.lines)?.detailId ?? "");
  const [filter, setFilter] = useState("");
  const [wrap, setWrap] = useState(true);

  useEffect(() => {
    setExpanded(initialExpanded(data.lines));
    setFocusedId(firstFocusableLine(data.lines)?.detailId ?? "");
    setFilter("");
  }, [data]);

  const fieldsById = useMemo(() => {
    const fields = new Map<string, KubeSchemaField>();
    for (const field of data.fields) {
      fields.set(field.id, field);
    }
    return fields;
  }, [data.fields]);

  const normalizedFilter = filter.trim().toLowerCase();
  const visibleLines = useMemo(
    () => visibleSchemaLines(data.lines, expanded, normalizedFilter),
    [data.lines, expanded, normalizedFilter],
  );
  const focusableLines = useMemo(() => visibleLines.filter(isFocusableLine), [visibleLines]);

  useEffect(() => {
    if (focusableLines.length === 0) {
      setFocusedId("");
      return;
    }
    if (!focusableLines.some((line) => line.detailId === focusedId)) {
      setFocusedId(focusableLines[0].detailId ?? "");
    }
  }, [focusableLines, focusedId]);

  useEffect(() => {
    if (!focusedId || !rootRef.current) {
      return;
    }
    const line = rootRef.current.querySelector(`[data-kdoc-detail-id="${cssEscape(focusedId)}"]`);
    line?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [focusedId]);

  const focusedLine = visibleLines.find((line) => line.detailId === focusedId) ?? focusableLines[0];
  const focusedField = focusedLine?.detailId ? fieldsById.get(focusedLine.detailId) : undefined;

  function toggleLine(line: KubeSchemaLine) {
    if (!line.foldable) {
      return;
    }
    setExpanded((current) => ({ ...current, [line.index]: !lineExpanded(line, current) }));
  }

  function focusLine(line?: KubeSchemaLine) {
    if (line?.detailId) {
      setFocusedId(line.detailId);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    const current = focusedLine;
    switch (event.key) {
      case "ArrowUp":
        focusLine(previousFocusable(focusableLines, current));
        event.preventDefault();
        return;
      case "ArrowDown":
        focusLine(nextFocusable(focusableLines, current));
        event.preventDefault();
        return;
      case "Home":
        focusLine(focusableLines[0]);
        event.preventDefault();
        return;
      case "End":
        focusLine(focusableLines[focusableLines.length - 1]);
        event.preventDefault();
        return;
      case "ArrowLeft":
        if (current?.foldable && lineExpanded(current, expanded) && !normalizedFilter) {
          setExpanded((state) => ({ ...state, [current.index]: false }));
        } else {
          focusLine(parentLine(visibleLines, current));
        }
        event.preventDefault();
        return;
      case "ArrowRight":
        if (current?.foldable && !lineExpanded(current, expanded)) {
          setExpanded((state) => ({ ...state, [current.index]: true }));
        } else {
          focusLine(firstChildLine(visibleLines, current));
        }
        event.preventDefault();
        return;
      case "Enter":
        if (current?.foldable) {
          toggleLine(current);
          event.preventDefault();
        }
        return;
      case "Tab":
        focusLine(event.shiftKey ? previousFoldable(visibleLines, current) : nextFoldable(visibleLines, current));
        event.preventDefault();
        return;
      case "Escape":
        if (filter) {
          setFilter("");
          event.preventDefault();
        }
        return;
      case "Backspace":
        if (filtering && filter) {
          setFilter((value) => value.slice(0, -1));
          event.preventDefault();
        }
        return;
      default:
        if (filtering && event.key.length === 1 && !event.shiftKey) {
          setFilter((value) => value + event.key);
          event.preventDefault();
        }
    }
  }

  return (
    <div
      ref={rootRef}
      className={`kdoc-fern${wrap ? " kdoc-fern-wrap" : ""}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`${data.kind} schema`}
    >
      <style>{styles}</style>
      <div className="kdoc-fern-toolbar">
        {filtering && filter ? <div className="kdoc-fern-filter">filter: {filter}</div> : <div />}
        <span className="kdoc-fern-hint">up/down focus, left/right fold, enter toggle, type to filter</span>
      </div>
      <div className="kdoc-fern-layout">
        <section className="kdoc-fern-tree" role="tree" aria-label={`${data.kind} YAML schema`}>
          {visibleLines.map((line) => (
            <SchemaLine
              key={`${line.index}-${line.detailId ?? ""}`}
              line={line}
              expanded={lineExpanded(line, expanded)}
              focused={line.detailId === focusedId}
              filter={normalizedFilter}
              onFocus={() => focusLine(line)}
              onToggle={() => toggleLine(line)}
            />
          ))}
        </section>
        <aside className="kdoc-fern-details" aria-live="polite">
          <h2>Details</h2>
          {focusedField ? <FieldDetails field={focusedField} /> : <p className="kdoc-fern-empty">Select a field.</p>}
        </aside>
      </div>
      <div className="kdoc-fern-controls">
        <label className="kdoc-fern-wrap-toggle">
          <input type="checkbox" checked={wrap} onChange={(event) => setWrap(event.target.checked)} />
          <span className="kdoc-fern-switch" aria-hidden="true" />
          <span>wrap</span>
        </label>
      </div>
    </div>
  );
}

function SchemaLine({
  line,
  expanded,
  focused,
  filter,
  onFocus,
  onToggle,
}: {
  line: KubeSchemaLine;
  expanded: boolean;
  focused: boolean;
  filter: string;
  onFocus: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={`kdoc-fern-line${focused ? " kdoc-fern-selected" : ""}${line.text.trim() ? "" : " kdoc-fern-blank"}`}
      role="treeitem"
      aria-selected={focused}
      data-kdoc-detail-id={line.detailId}
      data-depth={line.depth}
      onClick={onFocus}
    >
      {line.foldable ? (
        <button
          className="kdoc-fern-fold"
          type="button"
          aria-label={expanded ? "Collapse" : "Expand"}
          aria-expanded={expanded}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
            onFocus();
          }}
        />
      ) : (
        <span className="kdoc-fern-gutter" />
      )}
      <span className={`kdoc-fern-yaml${isStandaloneComment(line) ? " kdoc-fern-comment-line" : ""}`}>
        {renderYAMLText(line, filter)}
      </span>
    </div>
  );
}

function FieldDetails({ field }: { field: KubeSchemaField }) {
  return (
    <div className="kdoc-fern-detail-body">
      <dl className="kdoc-fern-detail-grid">
        <div className="kdoc-fern-detail-row">
          <dt>Path</dt>
          <dd>
            <code>{field.path}</code>
          </dd>
        </div>
        <div className="kdoc-fern-detail-row">
          <dt>Type</dt>
          <dd>
            <code>{field.type}</code>
          </dd>
        </div>
        <div className="kdoc-fern-detail-row">
          <dt>Required</dt>
          <dd>
            <span className={`kdoc-fern-badge ${field.required ? "kdoc-fern-badge-required" : "kdoc-fern-badge-optional"}`}>
              {field.required ? "yes" : "no"}
            </span>
          </dd>
        </div>
      </dl>
      {field.description ? (
        <section className="kdoc-fern-detail-section">
          <h3>Description</h3>
          <p>{field.description}</p>
        </section>
      ) : null}
      {field.metadata?.length ? (
        <section className="kdoc-fern-detail-section">
          <h3>Validation and metadata</h3>
          <ul>
            {field.metadata.map((item, index) => (
              <li key={`${item}-${index}`}>
                <code>{item}</code>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function visibleSchemaLines(lines: KubeSchemaLine[], expanded: Record<number, boolean>, filter: string) {
  if (filter) {
    const matchedPaths = lines.filter((line) => lineMatchesFilter(line, filter)).map((line) => line.path).filter(Boolean) as string[];
    return lines.filter((line) => {
      if (!line.text.trim()) {
        return false;
      }
      if (!line.path) {
        return lineMatchesFilter(line, filter);
      }
      return matchedPaths.some((path) => samePath(line.path, path) || isAncestorPath(line.path, path) || isAncestorPath(path, line.path));
    });
  }

  const visible: KubeSchemaLine[] = [];
  const collapsedDepths: number[] = [];
  for (const line of lines) {
    while (collapsedDepths.length && line.depth <= collapsedDepths[collapsedDepths.length - 1]) {
      collapsedDepths.pop();
    }
    if (collapsedDepths.length === 0) {
      visible.push(line);
    }
    if (line.foldable && !lineExpanded(line, expanded)) {
      collapsedDepths.push(line.depth);
    }
  }
  return visible;
}

function lineMatchesFilter(line: KubeSchemaLine, filter: string) {
  const text = `${line.filterText ?? ""}\n${line.field ?? ""}\n${line.path ?? ""}\n${line.description ?? ""}`.toLowerCase();
  return text.includes(filter);
}

function isAncestorPath(parent: string, child: string) {
  return child.startsWith(`${parent}.`) || child.startsWith(`${parent}[]`) || child.startsWith(`${parent}.<key>`);
}

function samePath(left: string, right: string) {
  return left === right;
}

function initialExpanded(lines: KubeSchemaLine[]) {
  const expanded: Record<number, boolean> = {};
  for (const line of lines) {
    if (line.foldable) {
      expanded[line.index] = !line.collapsed;
    }
  }
  return expanded;
}

function lineExpanded(line: KubeSchemaLine, expanded: Record<number, boolean>) {
  if (!line.foldable) {
    return true;
  }
  return expanded[line.index] ?? !line.collapsed;
}

function isFocusableLine(line: KubeSchemaLine) {
  return Boolean(line.code && line.detailId && line.text.trim());
}

function firstFocusableLine(lines: KubeSchemaLine[]) {
  return lines.find(isFocusableLine);
}

function previousFocusable(lines: KubeSchemaLine[], current?: KubeSchemaLine) {
  const index = current ? lines.findIndex((line) => line.detailId === current.detailId) : -1;
  return lines[Math.max(0, index - 1)] ?? current;
}

function nextFocusable(lines: KubeSchemaLine[], current?: KubeSchemaLine) {
  const index = current ? lines.findIndex((line) => line.detailId === current.detailId) : -1;
  return lines[Math.min(lines.length - 1, index + 1)] ?? current;
}

function parentLine(lines: KubeSchemaLine[], current?: KubeSchemaLine) {
  if (!current) {
    return undefined;
  }
  const index = lines.findIndex((line) => line.detailId === current.detailId);
  for (let i = index - 1; i >= 0; i--) {
    if (lines[i].depth < current.depth && isFocusableLine(lines[i])) {
      return lines[i];
    }
  }
  return current;
}

function firstChildLine(lines: KubeSchemaLine[], current?: KubeSchemaLine) {
  if (!current) {
    return undefined;
  }
  const index = lines.findIndex((line) => line.detailId === current.detailId);
  for (let i = index + 1; i < lines.length; i++) {
    if (lines[i].depth <= current.depth) {
      break;
    }
    if (isFocusableLine(lines[i])) {
      return lines[i];
    }
  }
  return current;
}

function previousFoldable(lines: KubeSchemaLine[], current?: KubeSchemaLine) {
  const index = current ? lines.findIndex((line) => line.detailId === current.detailId) : lines.length;
  for (let i = index - 1; i >= 0; i--) {
    if (lines[i].foldable) {
      return lines[i];
    }
  }
  return current;
}

function nextFoldable(lines: KubeSchemaLine[], current?: KubeSchemaLine) {
  const index = current ? lines.findIndex((line) => line.detailId === current.detailId) : -1;
  for (let i = index + 1; i < lines.length; i++) {
    if (lines[i].foldable) {
      return lines[i];
    }
  }
  return current;
}

function renderYAMLText(line: KubeSchemaLine, filter: string) {
  const indentLength = line.text.length - line.text.trimStart().length;
  const indent = line.text.slice(0, indentLength);
  const rest = line.text.slice(indentLength);
  if (!rest) {
    return indent;
  }
  if (isStandaloneComment(line)) {
    return (
      <>
        {indent}
        {renderHighlightedSpan("kdoc-fern-yaml-comment", rest, filter)}
      </>
    );
  }
  if (rest.startsWith("# ")) {
    const content = rest.slice(2);
    if (line.field) {
      return (
        <>
          {indent}
          <span className="kdoc-fern-yaml-comment"># </span>
          {renderYAMLCode(content, filter)}
        </>
      );
    }
    return (
      <>
        {indent}
        {renderHighlightedSpan("kdoc-fern-yaml-comment", rest, filter)}
      </>
    );
  }
  return (
    <>
      {indent}
      {renderYAMLCode(rest, filter)}
    </>
  );
}

function isStandaloneComment(line: KubeSchemaLine) {
  const rest = line.text.trimStart();
  return !line.field && (rest.startsWith("# ") || rest.startsWith("- # ") || rest.startsWith("# - # "));
}

function renderYAMLCode(code: string, filter: string) {
  const inlineCommentIndex = code.indexOf(" # ");
  const inlineComment = inlineCommentIndex >= 0 ? code.slice(inlineCommentIndex) : "";
  const codePart = inlineCommentIndex >= 0 ? code.slice(0, inlineCommentIndex) : code;
  const nodes: ReactNode[] = [];
  let rest = codePart;

  if (rest.startsWith("- ")) {
    nodes.push(<span key="dash" className="kdoc-fern-yaml-punct">-</span>, " ");
    rest = rest.slice(2);
  } else if (rest === "-") {
    nodes.push(<span key="dash" className="kdoc-fern-yaml-punct">-</span>);
    rest = "";
  }

  const colon = rest.indexOf(":");
  if (colon > 0) {
    const key = rest.slice(0, colon);
    const value = rest.slice(colon + 1);
    nodes.push(renderHighlightedSpan("kdoc-fern-yaml-key", key, filter, "key"));
    nodes.push(<span key="colon" className="kdoc-fern-yaml-punct">:</span>);
    nodes.push(renderYAMLValue(value, filter, "value"));
  } else if (rest) {
    nodes.push(renderYAMLValue(rest, filter, "value"));
  }

  if (inlineComment) {
    nodes.push(renderYAMLComment(inlineComment, filter));
  }
  return nodes;
}

function renderYAMLValue(value: string, filter: string, keyPrefix: string) {
  const leadingLength = value.length - value.trimStart().length;
  if (leadingLength === value.length) {
    return value;
  }
  return (
    <span key={keyPrefix}>
      {value.slice(0, leadingLength)}
      {renderYAMLScalar(value.slice(leadingLength), filter, `${keyPrefix}-scalar`)}
    </span>
  );
}

function renderYAMLScalar(value: string, filter: string, keyPrefix: string) {
  const nodes: ReactNode[] = [];
  for (let i = 0; i < value.length;) {
    const char = value[i];
    if ("[]{}:, ".includes(char) || char === "\t") {
      nodes.push(
        char === " " || char === "\t" ? char : <span key={`${keyPrefix}-${i}`} className="kdoc-fern-yaml-punct">{char}</span>,
      );
      i++;
      continue;
    }
    if (char === '"' || char === "'") {
      const end = quotedEnd(value, i);
      nodes.push(renderHighlightedSpan("kdoc-fern-yaml-string", value.slice(i, end), filter, `${keyPrefix}-${i}`));
      i = end;
      continue;
    }
    const end = tokenEnd(value, i);
    const token = value.slice(i, end);
    nodes.push(renderScalarToken(token, filter, `${keyPrefix}-${i}`));
    i = end;
  }
  return nodes;
}

function renderYAMLComment(comment: string, filter: string) {
  const match = requiredCommentToken(comment);
  if (!match) {
    return renderHighlightedSpan("kdoc-fern-yaml-comment", comment, filter, "comment");
  }
  const [start, end] = match;
  return (
    <span key="comment">
      {start > 0 ? renderHighlightedSpan("kdoc-fern-yaml-comment", comment.slice(0, start), filter, "comment-prefix") : null}
      <span className="kdoc-fern-required-label">required</span>
      {end < comment.length ? renderHighlightedSpan("kdoc-fern-yaml-comment", comment.slice(end), filter, "comment-suffix") : null}
    </span>
  );
}

function requiredCommentToken(comment: string): [number, number] | null {
  const token = "required";
  let start = 0;
  while (start < comment.length) {
    const index = comment.indexOf(token, start);
    if (index < 0) {
      return null;
    }
    const end = index + token.length;
    if (commentTokenBoundary(comment[index - 1]) && commentTokenBoundary(comment[end])) {
      return [index, end];
    }
    start = end;
  }
  return null;
}

function commentTokenBoundary(char?: string) {
  return !char || char === " " || char === "\t" || char === "," || char === ";" || char === "#";
}

function renderScalarToken(token: string, filter: string, key: string) {
  let className = "kdoc-fern-yaml-scalar";
  if (token.startsWith("<") && token.endsWith(">")) {
    className = placeholderClass(token);
  } else if (token === "true" || token === "false") {
    className = "kdoc-fern-yaml-bool";
  } else if (token === "null") {
    className = "kdoc-fern-yaml-null";
  } else if (!Number.isNaN(Number(token))) {
    className = "kdoc-fern-yaml-number";
  }
  return renderHighlightedSpan(className, token, filter, key);
}

function placeholderClass(token: string) {
  const inner = token.slice(1, -1);
  if (inner === "string" || inner === "name") {
    return "kdoc-fern-yaml-string";
  }
  if (inner === "boolean") {
    return "kdoc-fern-yaml-bool";
  }
  if (["integer", "number", "int", "int32", "int64", "float", "float32", "float64", "double"].includes(inner)) {
    return "kdoc-fern-yaml-type-number";
  }
  return "kdoc-fern-yaml-placeholder";
}

function renderHighlightedSpan(className: string, text: string, filter: string, key = text) {
  if (!filter || !text.toLowerCase().includes(filter)) {
    return <span key={key} className={className}>{text}</span>;
  }
  const nodes: ReactNode[] = [];
  let offset = 0;
  let part = 0;
  const lower = text.toLowerCase();
  while (offset < text.length) {
    const index = lower.indexOf(filter, offset);
    if (index < 0) {
      nodes.push(<span key={`${key}-${part++}`} className={className}>{text.slice(offset)}</span>);
      break;
    }
    if (index > offset) {
      nodes.push(<span key={`${key}-${part++}`} className={className}>{text.slice(offset, index)}</span>);
    }
    nodes.push(<span key={`${key}-${part++}`} className="kdoc-fern-filter-hit">{text.slice(index, index + filter.length)}</span>);
    offset = index + filter.length;
  }
  return <span key={key}>{nodes}</span>;
}

function quotedEnd(value: string, start: number) {
  const quote = value[start];
  for (let i = start + 1; i < value.length; i++) {
    if (value[i] === "\\" && quote === '"') {
      i++;
      continue;
    }
    if (value[i] === quote) {
      return i + 1;
    }
  }
  return value.length;
}

function tokenEnd(value: string, start: number) {
  for (let i = start; i < value.length; i++) {
    const char = value[i];
    if ("[]{}:, ".includes(char) || char === "\t") {
      return i;
    }
  }
  return value.length;
}

function cssEscape(value: string) {
  if (typeof CSS !== "undefined" && CSS.escape) {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "\\$&");
}

const styles = `
.kdoc-fern{--kdoc-fg:#1f2933;--kdoc-muted:#57606a;--kdoc-border:#d8dee4;--kdoc-panel:#f6f8fa;--kdoc-selected:#fff7cc;--kdoc-filter:#fb8500;--kdoc-required:#cf222e;--kdoc-ok:#116329;--kdoc-yaml-key:#0550ae;--kdoc-yaml-string:#0a7f42;--kdoc-yaml-comment:#6e7781;--kdoc-yaml-punct:#8c959f;--kdoc-yaml-number:#953800;--kdoc-yaml-type-number:#007c89;--kdoc-yaml-bool:#8250df;color:var(--kdoc-fg);max-width:100%;position:relative}
.kdoc-fern *{box-sizing:border-box}
.kdoc-fern:focus{outline:0}
.kdoc-fern-toolbar{align-items:center;display:flex;gap:.75rem;justify-content:space-between;margin:0 0 .6rem;min-height:1.8rem}
.kdoc-fern-filter{background:#fff7cc;border:1px solid #f0d35b;border-radius:6px;color:#7a4b00;font:12px/1.25 ui-monospace,SFMono-Regular,SFMono,Consolas,"Liberation Mono",Menlo,monospace;padding:4px 7px}
.kdoc-fern-hint{color:var(--kdoc-muted);font-size:12px}
.kdoc-fern-layout{align-items:start;display:grid;gap:1rem;grid-template-columns:minmax(0,1fr) minmax(220px,30%)}
.kdoc-fern-tree{background:var(--kdoc-panel);border:1px solid var(--kdoc-border);border-radius:8px;max-height:70vh;overflow:auto;padding:10px 0}
.kdoc-fern-line{align-items:flex-start;display:flex;font:13px/1.3 ui-monospace,SFMono-Regular,SFMono,Consolas,"Liberation Mono",Menlo,monospace;min-height:1.3em;padding:0 12px;white-space:pre}
.kdoc-fern-fold,.kdoc-fern-gutter{background:transparent;border:0;color:var(--kdoc-muted);display:block;flex:0 0 24px;font:inherit;height:1.3em;line-height:inherit;margin:0;padding:0;text-align:left;user-select:none}
.kdoc-fern-fold{cursor:pointer}
.kdoc-fern-fold:focus{outline:0}
.kdoc-fern-fold::before{content:"▶";display:block;line-height:inherit}
.kdoc-fern-fold[aria-expanded="true"]::before{content:"▼"}
.kdoc-fern-yaml{min-width:0;white-space:pre}
.kdoc-fern-wrap .kdoc-fern-comment-line{display:block;flex:1 1 auto;white-space:pre-wrap}
.kdoc-fern-yaml-key{color:var(--kdoc-yaml-key);font-weight:600}
.kdoc-fern-yaml-string{color:var(--kdoc-yaml-string)}
.kdoc-fern-yaml-comment{color:var(--kdoc-yaml-comment)}
.kdoc-fern-yaml-punct{color:var(--kdoc-yaml-punct)}
.kdoc-fern-yaml-number{color:var(--kdoc-yaml-number)}
.kdoc-fern-yaml-type-number{color:var(--kdoc-yaml-type-number)}
.kdoc-fern-yaml-bool,.kdoc-fern-yaml-null{color:var(--kdoc-yaml-bool)}
.kdoc-fern-yaml-placeholder,.kdoc-fern-yaml-scalar{color:var(--kdoc-muted)}
.kdoc-fern-required-label{background:#ffebe9;border:1px solid #ff8182;border-radius:999px;color:var(--kdoc-required);display:inline-block;font-weight:700;line-height:1.1;padding:0 .35em;vertical-align:baseline}
.kdoc-fern-filter-hit{background:var(--kdoc-filter);border-radius:2px;color:#111;font-weight:700;padding:0 .08em}
.kdoc-fern-selected .kdoc-fern-yaml{background:var(--kdoc-selected)}
.kdoc-fern-details{align-self:start;background:#fff;border:1px solid var(--kdoc-border);border-radius:8px;font:13px/1.45 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-height:70vh;min-width:0;overflow:auto;padding:12px;position:sticky;scrollbar-gutter:stable;top:12px}
.kdoc-fern-details h2{font-size:16px;line-height:1.25;margin:0 0 10px}
.kdoc-fern-empty{color:var(--kdoc-muted);margin:0}
.kdoc-fern-detail-body{display:grid;gap:12px}
.kdoc-fern-detail-grid{display:grid;gap:7px;margin:0}
.kdoc-fern-detail-row{align-items:baseline;display:grid;gap:8px;grid-template-columns:72px minmax(0,1fr)}
.kdoc-fern-detail-row dt{color:var(--kdoc-muted);font-size:11px;font-weight:700;letter-spacing:.02em;line-height:inherit;text-transform:uppercase}
.kdoc-fern-detail-row dd{line-height:inherit;margin:0;min-width:0}
.kdoc-fern-detail-row code,.kdoc-fern-detail-section code{font:12px/1.45 ui-monospace,SFMono-Regular,SFMono,Consolas,"Liberation Mono",Menlo,monospace;overflow-wrap:anywhere}
.kdoc-fern-badge{background:#eaeef2;border:1px solid var(--kdoc-border);border-radius:999px;color:#24292f;display:inline-block;font-size:12px;font-weight:600;line-height:1;padding:.2em .55em}
.kdoc-fern-badge-required{background:#ffebe9;border-color:#ff8182;color:var(--kdoc-required)}
.kdoc-fern-badge-optional{background:#dafbe1;border-color:#aceebb;color:var(--kdoc-ok)}
.kdoc-fern-detail-section{border-top:1px solid var(--kdoc-border);min-width:0;padding-top:10px}
.kdoc-fern-detail-section h3{color:var(--kdoc-muted);font-size:11px;letter-spacing:.02em;margin:0 0 6px;text-transform:uppercase}
.kdoc-fern-detail-section p{margin:0;overflow-wrap:anywhere;white-space:pre-wrap}
.kdoc-fern-detail-section ul{display:grid;gap:4px;margin:0;padding-left:18px}
.kdoc-fern-controls{bottom:calc(12px + 2.5em);display:flex;height:0;justify-content:flex-end;pointer-events:none;position:sticky;z-index:4}
.kdoc-fern-wrap-toggle{align-items:center;background:transparent;border:0;color:var(--kdoc-muted);cursor:pointer;display:flex;font-size:12px;font-weight:600;gap:.65em;line-height:1;padding:0;pointer-events:auto}
.kdoc-fern-wrap-toggle input{block-size:1px;clip:rect(0 0 0 0);clip-path:inset(50%);inline-size:1px;margin:0;overflow:hidden;position:absolute;white-space:nowrap}
.kdoc-fern-switch{background:#d0d7de;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(31,41,51,.08);display:inline-block;flex:0 0 auto;inline-size:2.65em;block-size:1.5em;position:relative;transition:background-color .16s ease,box-shadow .16s ease}
.kdoc-fern-switch::after{background:#fff;border-radius:50%;box-shadow:0 .08em .24em rgba(31,41,51,.28);content:"";display:block;inline-size:1.18em;block-size:1.18em;position:absolute;inset-block-start:50%;inset-inline-start:.16em;transform:translateY(-50%);transition:inset-inline-start .16s ease}
.kdoc-fern-wrap-toggle input:checked + .kdoc-fern-switch{background:#34c759;box-shadow:inset 0 0 0 1px rgba(17,99,41,.12)}
.kdoc-fern-wrap-toggle input:checked + .kdoc-fern-switch::after{inset-inline-start:1.31em}
@media(max-width:900px){.kdoc-fern-layout{grid-template-columns:1fr}.kdoc-fern-details{max-height:50vh}.kdoc-fern-hint{display:none}}
`;

export default KubeSchemaDoc;
