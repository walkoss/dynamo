"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { KubeSchemaDoc } from "./KubeSchemaDoc";
import type { KubeSchemaDocument } from "./KubeSchemaDoc";

type SchemaSource = {
  initial: string;
  full?: string;
};

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const schemaSources: Record<string, SchemaSource> = {
  "DynamoCheckpointSchema0": { initial: "./dynamo-checkpoint-schema-0.md", full: "./dynamo-checkpoint-schema-0-full.md" },
  "DynamoComponentDeploymentSchema0": { initial: "./dynamo-component-deployment-schema-0.md", full: "./dynamo-component-deployment-schema-0-full.md" },
  "DynamoComponentDeploymentSchema1": { initial: "./dynamo-component-deployment-schema-1.md", full: "./dynamo-component-deployment-schema-1-full.md" },
  "DynamoGraphDeploymentRequestSchema0": { initial: "./dynamo-graph-deployment-request-schema-0.md", full: "./dynamo-graph-deployment-request-schema-0-full.md" },
  "DynamoGraphDeploymentRequestSchema1": { initial: "./dynamo-graph-deployment-request-schema-1.md", full: "./dynamo-graph-deployment-request-schema-1-full.md" },
  "DynamoGraphDeploymentScalingAdapterSchema0": { initial: "./dynamo-graph-deployment-scaling-adapter-schema-0.md", full: "./dynamo-graph-deployment-scaling-adapter-schema-0-full.md" },
  "DynamoGraphDeploymentScalingAdapterSchema1": { initial: "./dynamo-graph-deployment-scaling-adapter-schema-1.md", full: "./dynamo-graph-deployment-scaling-adapter-schema-1-full.md" },
  "DynamoGraphDeploymentSchema0": { initial: "./dynamo-graph-deployment-schema-0.md", full: "./dynamo-graph-deployment-schema-0-full.md" },
  "DynamoGraphDeploymentSchema1": { initial: "./dynamo-graph-deployment-schema-1.md", full: "./dynamo-graph-deployment-schema-1-full.md" },
  "DynamoModelSchema0": { initial: "./dynamo-model-schema-0.md", full: "./dynamo-model-schema-0-full.md" },
  "DynamoWorkerMetadataSchema0": { initial: "./dynamo-worker-metadata-schema-0.md", full: "./dynamo-worker-metadata-schema-0-full.md" },
};

function resolveSchemaSource(source: string) {
  if (source.startsWith("http://") || source.startsWith("https://") || source.startsWith("/")) {
    return source;
  }

  return new URL(source, window.location.href.replace(/\/$/, "")).toString();
}

function decodeBase64UTF8(value: string) {
  const bytes = Uint8Array.from(atob(value.replace(/\s+/g, "")), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseSchemaPayload(payload: string): KubeSchemaDocument {
  const encodedMatch = payload.match(/```kubectl-doc-schema\s*([\s\S]*?)\s*```/);
  if (encodedMatch) {
    return JSON.parse(decodeBase64UTF8(encodedMatch[1])) as KubeSchemaDocument;
  }

  const jsonMatch = payload.match(/```json\s*([\s\S]*?)\s*```/);
  return JSON.parse(jsonMatch ? jsonMatch[1] : payload) as KubeSchemaDocument;
}

export function LazyKubeSchemaDoc({ name, filtering = true }: { name: string; filtering?: boolean }) {
  const [data, setData] = useState<KubeSchemaDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadingFullRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const source = schemaSources[name];

    setData(null);
    setError(null);
    loadingFullRef.current = false;

    if (!source) {
      setError(`Unknown schema document: ${name}`);
      return () => {
        cancelled = true;
      };
    }

    fetch(resolveSchemaSource(source.initial))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((payload) => {
        if (!cancelled) {
          setData(parseSchemaPayload(payload));
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : String(loadError));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  const loadFull = useCallback(() => {
    const source = schemaSources[name]?.full;
    if (!source || loadingFullRef.current || data?.complete) {
      return;
    }

    loadingFullRef.current = true;
    fetch(resolveSchemaSource(source))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((payload) => setData(parseSchemaPayload(payload)))
      .catch((loadError: unknown) => {
        loadingFullRef.current = false;
        setError(loadError instanceof Error ? loadError.message : String(loadError));
      });
  }, [data?.complete, name]);

  useEffect(() => {
    if (!data || data.complete) {
      return;
    }

    const idleWindow = window as IdleWindow;
    const idleCallback = idleWindow.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1500));
    const cancelIdleCallback = idleWindow.cancelIdleCallback ?? ((handle: number) => window.clearTimeout(handle));

    const handle = idleCallback(() => loadFull());
    return () => cancelIdleCallback(handle);
  }, [data, loadFull]);

  if (error) {
    return <div className="kdoc-fern-lazy kdoc-fern-lazy-error">Schema failed to load: {error}</div>;
  }

  if (!data) {
    return <div className="kdoc-fern-lazy">Loading schema...</div>;
  }

  return <KubeSchemaDoc data={data} filtering={filtering} onLoadFull={loadFull} />;
}
