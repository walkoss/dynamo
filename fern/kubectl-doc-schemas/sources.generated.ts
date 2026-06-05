import type { KubeSchemaDocument } from "../components/kubectl-doc/KubeSchemaDoc";

import DynamoCheckpointSchema0Initial from "./dynamo-checkpoint-schema-0.json";
import DynamoComponentDeploymentSchema0Initial from "./dynamo-component-deployment-schema-0.json";
import DynamoComponentDeploymentSchema1Initial from "./dynamo-component-deployment-schema-1.json";
import DynamoGraphDeploymentRequestSchema0Initial from "./dynamo-graph-deployment-request-schema-0.json";
import DynamoGraphDeploymentRequestSchema1Initial from "./dynamo-graph-deployment-request-schema-1.json";
import DynamoGraphDeploymentScalingAdapterSchema0Initial from "./dynamo-graph-deployment-scaling-adapter-schema-0.json";
import DynamoGraphDeploymentScalingAdapterSchema1Initial from "./dynamo-graph-deployment-scaling-adapter-schema-1.json";
import DynamoGraphDeploymentSchema0Initial from "./dynamo-graph-deployment-schema-0.json";
import DynamoGraphDeploymentSchema1Initial from "./dynamo-graph-deployment-schema-1.json";
import DynamoModelSchema0Initial from "./dynamo-model-schema-0.json";
import DynamoWorkerMetadataSchema0Initial from "./dynamo-worker-metadata-schema-0.json";

export type SchemaSource = {
  initial: KubeSchemaDocument;
  loadFull?: () => Promise<KubeSchemaDocument>;
};

function jsonModule(module: { default?: KubeSchemaDocument } | KubeSchemaDocument) {
  return ("default" in module ? module.default : module) as KubeSchemaDocument;
}

export const schemaSources: Record<string, SchemaSource> = {
  "DynamoCheckpointSchema0": {
    initial: DynamoCheckpointSchema0Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-checkpoint-schema-0-full.json").then(jsonModule),
  },
  "DynamoComponentDeploymentSchema0": {
    initial: DynamoComponentDeploymentSchema0Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-component-deployment-schema-0-full.json").then(jsonModule),
  },
  "DynamoComponentDeploymentSchema1": {
    initial: DynamoComponentDeploymentSchema1Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-component-deployment-schema-1-full.json").then(jsonModule),
  },
  "DynamoGraphDeploymentRequestSchema0": {
    initial: DynamoGraphDeploymentRequestSchema0Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-graph-deployment-request-schema-0-full.json").then(jsonModule),
  },
  "DynamoGraphDeploymentRequestSchema1": {
    initial: DynamoGraphDeploymentRequestSchema1Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-graph-deployment-request-schema-1-full.json").then(jsonModule),
  },
  "DynamoGraphDeploymentScalingAdapterSchema0": {
    initial: DynamoGraphDeploymentScalingAdapterSchema0Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-graph-deployment-scaling-adapter-schema-0-full.json").then(jsonModule),
  },
  "DynamoGraphDeploymentScalingAdapterSchema1": {
    initial: DynamoGraphDeploymentScalingAdapterSchema1Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-graph-deployment-scaling-adapter-schema-1-full.json").then(jsonModule),
  },
  "DynamoGraphDeploymentSchema0": {
    initial: DynamoGraphDeploymentSchema0Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-graph-deployment-schema-0-full.json").then(jsonModule),
  },
  "DynamoGraphDeploymentSchema1": {
    initial: DynamoGraphDeploymentSchema1Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-graph-deployment-schema-1-full.json").then(jsonModule),
  },
  "DynamoModelSchema0": {
    initial: DynamoModelSchema0Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-model-schema-0-full.json").then(jsonModule),
  },
  "DynamoWorkerMetadataSchema0": {
    initial: DynamoWorkerMetadataSchema0Initial as KubeSchemaDocument,
    loadFull: () => import("./dynamo-worker-metadata-schema-0-full.json").then(jsonModule),
  },
};
