"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { KubeSchemaDoc } from "./KubeSchemaDoc";
import type { KubeSchemaDocument } from "./KubeSchemaDoc";

type SchemaSource = {
  initial: string;
  full?: string;
};

const schemaAssetPath = "../../../assets/kubectl-doc/schemas";

const schemaSources: Record<string, SchemaSource> = {
  "DynamoCheckpointSchema0": { initial: "dynamo-checkpoint-schema-0.json", full: "dynamo-checkpoint-schema-0-full.json" },
  "DynamoComponentDeploymentSchema0": { initial: "dynamo-component-deployment-schema-0.json", full: "dynamo-component-deployment-schema-0-full.json" },
  "DynamoComponentDeploymentSchema1": { initial: "dynamo-component-deployment-schema-1.json", full: "dynamo-component-deployment-schema-1-full.json" },
  "DynamoGraphDeploymentRequestSchema0": { initial: "dynamo-graph-deployment-request-schema-0.json", full: "dynamo-graph-deployment-request-schema-0-full.json" },
  "DynamoGraphDeploymentRequestSchema1": { initial: "dynamo-graph-deployment-request-schema-1.json", full: "dynamo-graph-deployment-request-schema-1-full.json" },
  "DynamoGraphDeploymentScalingAdapterSchema0": { initial: "dynamo-graph-deployment-scaling-adapter-schema-0.json", full: "dynamo-graph-deployment-scaling-adapter-schema-0-full.json" },
  "DynamoGraphDeploymentScalingAdapterSchema1": { initial: "dynamo-graph-deployment-scaling-adapter-schema-1.json", full: "dynamo-graph-deployment-scaling-adapter-schema-1-full.json" },
  "DynamoGraphDeploymentSchema0": { initial: "dynamo-graph-deployment-schema-0.json", full: "dynamo-graph-deployment-schema-0-full.json" },
  "DynamoGraphDeploymentSchema1": { initial: "dynamo-graph-deployment-schema-1.json", full: "dynamo-graph-deployment-schema-1-full.json" },
  "DynamoModelSchema0": { initial: "dynamo-model-schema-0.json", full: "dynamo-model-schema-0-full.json" },
  "DynamoWorkerMetadataSchema0": { initial: "dynamo-worker-metadata-schema-0.json", full: "dynamo-worker-metadata-schema-0-full.json" },
};

function schemaURL(fileName: string) {
  return `${schemaAssetPath}/${fileName}`;
}

function resolveSchemaSource(source: string) {
  if (source.startsWith("http://") || source.startsWith("https://") || source.startsWith("/")) {
    return source;
  }

  return new URL(source, window.location.href.replace(/\/$/, "")).toString();
}

function fetchSchema(source: string) {
  return fetch(resolveSchemaSource(source)).then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<KubeSchemaDocument>;
  });
}

export function LazyKubeSchemaDoc({ name, filtering = true }: { name: string; filtering?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<KubeSchemaDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const schemaGenerationRef = useRef(0);
  const loadingInitialRef = useRef(false);
  const fullLoadRef = useRef<Promise<KubeSchemaDocument> | null>(null);

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
    fullLoadRef.current = null;
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
    fetchSchema(schemaURL(source.initial))
      .then((payload) => {
        if (!cancelled && generation === schemaGenerationRef.current) {
          setData(payload);
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
    if (fullLoadRef.current) {
      return fullLoadRef.current;
    }

    const generation = schemaGenerationRef.current;
    const promise = fetchSchema(schemaURL(source))
      .then((next) => {
        if (generation !== schemaGenerationRef.current) {
          throw new Error("schema request superseded");
        }
        setData(next);
        return next;
      })
      .catch((loadError: unknown) => {
        if (generation === schemaGenerationRef.current) {
          setError(loadError instanceof Error ? loadError.message : String(loadError));
        }
        throw loadError;
      })
      .finally(() => {
        if (generation === schemaGenerationRef.current) {
          fullLoadRef.current = null;
        }
      });
    fullLoadRef.current = promise;
    return promise;
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
