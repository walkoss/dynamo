"use client";

import { useEffect, useState } from "react";

import { KubeSchemaDoc } from "./KubeSchemaDoc";
import type { KubeSchemaDocument } from "./KubeSchemaDoc";

const schemaSources: Record<string, string> = {
  "DynamoCheckpointSchema0": "./dynamo-checkpoint-schema-0.md",
  "DynamoComponentDeploymentSchema0": "./dynamo-component-deployment-schema-0.md",
  "DynamoComponentDeploymentSchema1": "./dynamo-component-deployment-schema-1.md",
  "DynamoGraphDeploymentRequestSchema0": "./dynamo-graph-deployment-request-schema-0.md",
  "DynamoGraphDeploymentRequestSchema1": "./dynamo-graph-deployment-request-schema-1.md",
  "DynamoGraphDeploymentScalingAdapterSchema0": "./dynamo-graph-deployment-scaling-adapter-schema-0.md",
  "DynamoGraphDeploymentScalingAdapterSchema1": "./dynamo-graph-deployment-scaling-adapter-schema-1.md",
  "DynamoGraphDeploymentSchema0": "./dynamo-graph-deployment-schema-0.md",
  "DynamoGraphDeploymentSchema1": "./dynamo-graph-deployment-schema-1.md",
  "DynamoModelSchema0": "./dynamo-model-schema-0.md",
  "DynamoWorkerMetadataSchema0": "./dynamo-worker-metadata-schema-0.md",
};

function resolveSchemaSource(source: string) {
  if (source.startsWith("http://") || source.startsWith("https://") || source.startsWith("/")) {
    return source;
  }

  return new URL(source, window.location.href.replace(/\/$/, "")).toString();
}

function parseSchemaPayload(payload: string): KubeSchemaDocument {
  const match = payload.match(/```json\s*([\s\S]*?)\s*```/);
  return JSON.parse(match ? match[1] : payload) as KubeSchemaDocument;
}

export function LazyKubeSchemaDoc({ name, filtering = true }: { name: string; filtering?: boolean }) {
  const [data, setData] = useState<KubeSchemaDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const source = schemaSources[name];

    setData(null);
    setError(null);

    if (!source) {
      setError(`Unknown schema document: ${name}`);
      return () => {
        cancelled = true;
      };
    }

    fetch(resolveSchemaSource(source))
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

  if (error) {
    return <div className="kdoc-fern-lazy kdoc-fern-lazy-error">Schema failed to load: {error}</div>;
  }

  if (!data) {
    return <div className="kdoc-fern-lazy">Loading schema...</div>;
  }

  return <KubeSchemaDoc data={data} filtering={filtering} />;
}
