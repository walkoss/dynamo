"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { KubeSchemaDoc } from "./KubeSchemaDoc";
import type { KubeSchemaDocument } from "./KubeSchemaDoc";

type SchemaSource = {
  initial: string;
  full?: string;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<KubeSchemaDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const schemaGenerationRef = useRef(0);
  const loadingInitialRef = useRef(false);
  const loadingFullRef = useRef(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      setIsVisible(entries.some((entry) => entry.isIntersecting));
    }, { rootMargin: "160px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    schemaGenerationRef.current += 1;
    setData(null);
    setError(null);
    loadingInitialRef.current = false;
    loadingFullRef.current = false;
  }, [name]);

  useEffect(() => {
    let cancelled = false;
    const source = schemaSources[name];

    if (!source) {
      setError(`Unknown schema document: ${name}`);
      return () => {
        cancelled = true;
      };
    }
    if (!isVisible || data || loadingInitialRef.current) {
      return () => {
        cancelled = true;
      };
    }

    loadingInitialRef.current = true;
    const generation = schemaGenerationRef.current;
    fetch(resolveSchemaSource(source.initial))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((payload) => {
        if (!cancelled && generation === schemaGenerationRef.current) {
          setData(parseSchemaPayload(payload));
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled && generation === schemaGenerationRef.current) {
          loadingInitialRef.current = false;
          setError(loadError instanceof Error ? loadError.message : String(loadError));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [data, isVisible, name]);

  const loadFull = useCallback(() => {
    const source = schemaSources[name]?.full;
    if (!source || data?.complete) {
      return false;
    }
    if (loadingFullRef.current) {
      return true;
    }

    loadingFullRef.current = true;
    const generation = schemaGenerationRef.current;
    fetch(resolveSchemaSource(source))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((payload) => {
        if (generation === schemaGenerationRef.current) {
          setData(parseSchemaPayload(payload));
        }
      })
      .catch((loadError: unknown) => {
        if (generation === schemaGenerationRef.current) {
          loadingFullRef.current = false;
          setError(loadError instanceof Error ? loadError.message : String(loadError));
        }
      });
    return true;
  }, [data?.complete, name]);

  return (
    <div ref={rootRef} className="kdoc-fern-lazy-frame">
      {error ? (
        <div className="kdoc-fern-lazy kdoc-fern-lazy-error">Schema failed to load: {error}</div>
      ) : data ? (
        <KubeSchemaDoc data={data} filtering={filtering} onLoadFull={loadFull} />
      ) : (
        <div className="kdoc-fern-lazy">Loading schema...</div>
      )}
    </div>
  );
}

export default LazyKubeSchemaDoc;
