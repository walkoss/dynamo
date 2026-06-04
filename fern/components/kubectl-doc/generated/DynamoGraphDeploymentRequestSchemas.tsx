"use client";

import { KubeSchemaDoc } from "../KubeSchemaDoc";

const kubectlDocSchemas = [
  {
    "apiVersion": "nvidia.com/v1beta1",
    "group": "nvidia.com",
    "version": "v1beta1",
    "kind": "DynamoGraphDeploymentRequest",
    "resource": "dynamographdeploymentrequests",
    "lines": [
      {
        "index": 0,
        "text": "apiVersion: nvidia.com/v1beta1",
        "description": "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        "depth": 0,
        "field": "apiVersion",
        "path": "apiVersion",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1beta1-apiversion"
      },
      {
        "index": 1,
        "text": "kind: DynamoGraphDeploymentRequest",
        "description": "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        "depth": 0,
        "field": "kind",
        "path": "kind",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1beta1-kind"
      },
      {
        "index": 2,
        "text": "metadata:",
        "description": "Standard Kubernetes object metadata.",
        "depth": 0,
        "field": "metadata",
        "path": "metadata",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1beta1-metadata"
      },
      {
        "index": 4,
        "text": "  name: \"<string>\" # required",
        "description": "Name must be unique within a namespace.",
        "depth": 1,
        "field": "name",
        "path": "metadata.name",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-name"
      },
      {
        "index": 7,
        "text": "  namespace: \"<string>\" # required",
        "description": "Namespace defines the space within which each name must be unique.",
        "depth": 1,
        "field": "namespace",
        "path": "metadata.namespace",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-namespace"
      },
      {
        "index": 10,
        "text": "  # annotations:",
        "description": "Annotations is an unstructured key value map stored with a resource.",
        "depth": 1,
        "field": "annotations",
        "path": "metadata.annotations",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-annotations"
      },
      {
        "index": 14,
        "text": "  # creationTimestamp: \"<string>\"",
        "description": "CreationTimestamp is set by the server when a resource is created.",
        "depth": 1,
        "field": "creationTimestamp",
        "path": "metadata.creationTimestamp",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-creationtimestamp"
      },
      {
        "index": 17,
        "text": "  # deletionGracePeriodSeconds: <int64>",
        "description": "Number of seconds allowed for graceful deletion.",
        "depth": 1,
        "field": "deletionGracePeriodSeconds",
        "path": "metadata.deletionGracePeriodSeconds",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-deletiongraceperiodseconds"
      },
      {
        "index": 20,
        "text": "  # deletionTimestamp: \"<string>\"",
        "description": "DeletionTimestamp is set by the server when graceful deletion is requested.",
        "depth": 1,
        "field": "deletionTimestamp",
        "path": "metadata.deletionTimestamp",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-deletiontimestamp"
      },
      {
        "index": 23,
        "text": "  # finalizers:",
        "description": "Finalizers must be empty before the object is deleted from the registry.",
        "depth": 1,
        "field": "finalizers",
        "path": "metadata.finalizers",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-finalizers"
      },
      {
        "index": 28,
        "text": "  # generateName: \"<string>\"",
        "description": "GenerateName is an optional prefix used by the server to generate a unique name.",
        "depth": 1,
        "field": "generateName",
        "path": "metadata.generateName",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-generatename"
      },
      {
        "index": 31,
        "text": "  # generation: <int64>",
        "description": "Generation is a sequence number representing a specific desired state.",
        "depth": 1,
        "field": "generation",
        "path": "metadata.generation",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-generation"
      },
      {
        "index": 34,
        "text": "  # labels:",
        "description": "Labels are key value pairs used to organize and select objects.",
        "depth": 1,
        "field": "labels",
        "path": "metadata.labels",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-labels"
      },
      {
        "index": 38,
        "text": "  # managedFields:",
        "description": "ManagedFields records which actor manages which fields.",
        "depth": 1,
        "field": "managedFields",
        "path": "metadata.managedFields",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-managedfields"
      },
      {
        "index": 62,
        "text": "  ownerReferences: # optional",
        "description": "OwnerReferences lists objects depended on by this object.",
        "depth": 1,
        "field": "ownerReferences",
        "path": "metadata.ownerReferences",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-ownerreferences"
      },
      {
        "index": 82,
        "text": "  # resourceVersion: \"<string>\"",
        "description": "ResourceVersion is an opaque internal version value.",
        "depth": 1,
        "field": "resourceVersion",
        "path": "metadata.resourceVersion",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-resourceversion"
      },
      {
        "index": 85,
        "text": "  # selfLink: \"<string>\"",
        "description": "SelfLink is a deprecated read-only field.",
        "depth": 1,
        "field": "selfLink",
        "path": "metadata.selfLink",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-selflink"
      },
      {
        "index": 88,
        "text": "  # uid: \"<string>\"",
        "description": "UID is the unique in time and space value for this object.",
        "depth": 1,
        "field": "uid",
        "path": "metadata.uid",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-uid"
      },
      {
        "index": 90,
        "text": "spec: # optional",
        "description": "Spec defines the desired state for this deployment request.",
        "depth": 0,
        "field": "spec",
        "path": "spec",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-spec"
      },
      {
        "index": 93,
        "text": "  model: \"<string>\" # required, minLength: 1",
        "description": "Model specifies the model to deploy (e.g., \"Qwen/Qwen3-0.6B\", \"meta-llama/Llama-3-70b\").\nCan be a HuggingFace ID or a private model name.",
        "depth": 1,
        "field": "model",
        "path": "spec.model",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1beta1-spec-model"
      },
      {
        "index": 98,
        "text": "  # autoApply: true # default",
        "description": "AutoApply indicates whether to automatically create a DynamoGraphDeployment\nafter profiling completes. If false, the generated spec is stored in status\nfor manual review and application.",
        "depth": 1,
        "field": "autoApply",
        "path": "spec.autoApply",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-autoapply"
      },
      {
        "index": 101,
        "text": "  # backend: \"auto\" # default",
        "description": "Backend specifies the inference backend to use for profiling and deployment.",
        "depth": 1,
        "field": "backend",
        "path": "spec.backend",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-backend"
      },
      {
        "index": 105,
        "text": "  # features:",
        "description": "Features controls optional Dynamo platform features in the generated deployment.",
        "depth": 1,
        "field": "features",
        "path": "spec.features",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-features"
      },
      {
        "index": 121,
        "text": "  # hardware:",
        "description": "Hardware describes the hardware resources available for profiling and deployment.\nTypically auto-filled by the operator from cluster discovery.",
        "depth": 1,
        "field": "hardware",
        "path": "spec.hardware",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-hardware"
      },
      {
        "index": 192,
        "text": "  # image: \"<string>\"",
        "description": "Image is the container image reference for the profiling job (planner image).\nExample: \"nvcr.io/nvidia/ai-dynamo/dynamo-planner:1.1.1\".\nFor Dynamo < 1.1.0, use dynamo-frontend.",
        "depth": 1,
        "field": "image",
        "path": "spec.image",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-image"
      },
      {
        "index": 197,
        "text": "  # modelCache:",
        "description": "ModelCache provides optional PVC configuration for pre-downloaded model weights.\nWhen provided, weights are loaded from the PVC instead of downloading from HuggingFace.",
        "depth": 1,
        "field": "modelCache",
        "path": "spec.modelCache",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-modelcache"
      },
      {
        "index": 211,
        "text": "  overrides: # optional",
        "description": "Overrides allows customizing the profiling job and the generated DynamoGraphDeployment.",
        "depth": 1,
        "field": "overrides",
        "path": "spec.overrides",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-overrides"
      },
      {
        "index": 6558,
        "text": "  # searchStrategy: \"rapid\" # default",
        "description": "SearchStrategy controls the profiling search depth.\n\"rapid\" performs a fast sweep; \"thorough\" explores more configurations.",
        "depth": 1,
        "field": "searchStrategy",
        "path": "spec.searchStrategy",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-searchstrategy"
      },
      {
        "index": 6562,
        "text": "  # sla:",
        "description": "SLA defines service-level agreement targets that drive profiling optimization.",
        "depth": 1,
        "field": "sla",
        "path": "spec.sla",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-sla"
      },
      {
        "index": 6579,
        "text": "  # workload:",
        "description": "Workload defines the expected workload characteristics for SLA-based profiling.",
        "depth": 1,
        "field": "workload",
        "path": "spec.workload",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-workload"
      },
      {
        "index": 6595,
        "text": "status: # optional",
        "description": "Status reflects the current observed state of this deployment request.",
        "depth": 0,
        "field": "status",
        "path": "status",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1beta1-status"
      },
      {
        "index": 6599,
        "text": "  conditions: # optional, listType: map, listMapKeys: type",
        "description": "Conditions contains the latest observed conditions of the deployment request.\nStandard condition types include: Succeeded, Validation, Profiling, SpecGenerated, DeploymentReady.",
        "depth": 1,
        "field": "conditions",
        "path": "status.conditions",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-conditions"
      },
      {
        "index": 6632,
        "text": "  # deploymentInfo:",
        "description": "DeploymentInfo tracks the state of the deployed DynamoGraphDeployment.\nPopulated when a DGD has been created (either via autoApply or manually).",
        "depth": 1,
        "field": "deploymentInfo",
        "path": "status.deploymentInfo",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-deploymentinfo"
      },
      {
        "index": 6640,
        "text": "  # dgdName: \"<string>\"",
        "description": "DGDName is the name of the generated or created DynamoGraphDeployment.",
        "depth": 1,
        "field": "dgdName",
        "path": "status.dgdName",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-dgdname"
      },
      {
        "index": 6643,
        "text": "  # observedGeneration: <int64>",
        "description": "ObservedGeneration is the most recent generation observed by the controller.",
        "depth": 1,
        "field": "observedGeneration",
        "path": "status.observedGeneration",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-observedgeneration"
      },
      {
        "index": 6646,
        "text": "  # phase: \"Pending\" # enum: \"Profiling\" | \"Ready\" | \"Deploying\" | \"Deployed\" |",
        "description": "Phase is the high-level lifecycle phase of the deployment request.",
        "depth": 1,
        "field": "phase",
        "path": "status.phase",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-phase"
      },
      {
        "index": 6650,
        "text": "  # profilingJobName: \"<string>\"",
        "description": "ProfilingJobName is the name of the Kubernetes Job running the profiler.",
        "depth": 1,
        "field": "profilingJobName",
        "path": "status.profilingJobName",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-profilingjobname"
      },
      {
        "index": 6655,
        "text": "  # profilingPhase: \"Initializing\" # enum: \"SweepingPrefill\" | \"SweepingDecode\"",
        "description": "ProfilingPhase indicates the current sub-phase of the profiling pipeline.\nOnly meaningful when Phase is \"Profiling\". Cleared when profiling completes or fails.",
        "depth": 1,
        "field": "profilingPhase",
        "path": "status.profilingPhase",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-profilingphase"
      },
      {
        "index": 6661,
        "text": "  profilingResults: # optional",
        "description": "ProfilingResults contains the output of the profiling process including\nPareto-optimal configurations and the selected deployment configuration.",
        "depth": 1,
        "field": "profilingResults",
        "path": "status.profilingResults",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-profilingresults"
      }
    ],
    "fields": [
      {
        "id": "field-nvidia-com-v1beta1-apiversion",
        "path": "apiVersion",
        "type": "string",
        "required": true,
        "description": "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources"
      },
      {
        "id": "field-nvidia-com-v1beta1-kind",
        "path": "kind",
        "type": "string",
        "required": true,
        "description": "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds"
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata",
        "path": "metadata",
        "type": "object",
        "required": true,
        "description": "Standard Kubernetes object metadata.",
        "metadata": [
          "requiredFields: name, namespace"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-annotations",
        "path": "metadata.annotations",
        "type": "object",
        "required": false,
        "description": "Annotations is an unstructured key value map stored with a resource."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-creationtimestamp",
        "path": "metadata.creationTimestamp",
        "type": "string/date-time",
        "required": false,
        "description": "CreationTimestamp is set by the server when a resource is created.",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-deletiongraceperiodseconds",
        "path": "metadata.deletionGracePeriodSeconds",
        "type": "integer/int64",
        "required": false,
        "description": "Number of seconds allowed for graceful deletion.",
        "metadata": [
          "format: int64"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-deletiontimestamp",
        "path": "metadata.deletionTimestamp",
        "type": "string/date-time",
        "required": false,
        "description": "DeletionTimestamp is set by the server when graceful deletion is requested.",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-finalizers",
        "path": "metadata.finalizers",
        "type": "array<string>",
        "required": false,
        "description": "Finalizers must be empty before the object is deleted from the registry."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-generatename",
        "path": "metadata.generateName",
        "type": "string",
        "required": false,
        "description": "GenerateName is an optional prefix used by the server to generate a unique name."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-generation",
        "path": "metadata.generation",
        "type": "integer/int64",
        "required": false,
        "description": "Generation is a sequence number representing a specific desired state.",
        "metadata": [
          "format: int64"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-labels",
        "path": "metadata.labels",
        "type": "object",
        "required": false,
        "description": "Labels are key value pairs used to organize and select objects."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-managedfields",
        "path": "metadata.managedFields",
        "type": "array<object>",
        "required": false,
        "description": "ManagedFields records which actor manages which fields."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-name",
        "path": "metadata.name",
        "type": "string",
        "required": true,
        "description": "Name must be unique within a namespace."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-namespace",
        "path": "metadata.namespace",
        "type": "string",
        "required": true,
        "description": "Namespace defines the space within which each name must be unique."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-ownerreferences",
        "path": "metadata.ownerReferences",
        "type": "array<object>",
        "required": false,
        "description": "OwnerReferences lists objects depended on by this object."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-resourceversion",
        "path": "metadata.resourceVersion",
        "type": "string",
        "required": false,
        "description": "ResourceVersion is an opaque internal version value."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-selflink",
        "path": "metadata.selfLink",
        "type": "string",
        "required": false,
        "description": "SelfLink is a deprecated read-only field."
      },
      {
        "id": "field-nvidia-com-v1beta1-metadata-uid",
        "path": "metadata.uid",
        "type": "string",
        "required": false,
        "description": "UID is the unique in time and space value for this object."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec",
        "path": "spec",
        "type": "object",
        "required": false,
        "description": "Spec defines the desired state for this deployment request.",
        "metadata": [
          "requiredFields: model"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-autoapply",
        "path": "spec.autoApply",
        "type": "boolean",
        "required": false,
        "description": "AutoApply indicates whether to automatically create a DynamoGraphDeployment\nafter profiling completes. If false, the generated spec is stored in status\nfor manual review and application.",
        "metadata": [
          "default: true"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-backend",
        "path": "spec.backend",
        "type": "string",
        "required": false,
        "description": "Backend specifies the inference backend to use for profiling and deployment.",
        "metadata": [
          "default: \"auto\""
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-features",
        "path": "spec.features",
        "type": "object",
        "required": false,
        "description": "Features controls optional Dynamo platform features in the generated deployment."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-hardware",
        "path": "spec.hardware",
        "type": "object",
        "required": false,
        "description": "Hardware describes the hardware resources available for profiling and deployment.\nTypically auto-filled by the operator from cluster discovery."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-image",
        "path": "spec.image",
        "type": "string",
        "required": false,
        "description": "Image is the container image reference for the profiling job (planner image).\nExample: \"nvcr.io/nvidia/ai-dynamo/dynamo-planner:1.1.1\".\nFor Dynamo < 1.1.0, use dynamo-frontend."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-model",
        "path": "spec.model",
        "type": "string",
        "required": true,
        "description": "Model specifies the model to deploy (e.g., \"Qwen/Qwen3-0.6B\", \"meta-llama/Llama-3-70b\").\nCan be a HuggingFace ID or a private model name.",
        "metadata": [
          "minLength: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-modelcache",
        "path": "spec.modelCache",
        "type": "object",
        "required": false,
        "description": "ModelCache provides optional PVC configuration for pre-downloaded model weights.\nWhen provided, weights are loaded from the PVC instead of downloading from HuggingFace."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-overrides",
        "path": "spec.overrides",
        "type": "object",
        "required": false,
        "description": "Overrides allows customizing the profiling job and the generated DynamoGraphDeployment."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-searchstrategy",
        "path": "spec.searchStrategy",
        "type": "string",
        "required": false,
        "description": "SearchStrategy controls the profiling search depth.\n\"rapid\" performs a fast sweep; \"thorough\" explores more configurations.",
        "metadata": [
          "default: \"rapid\""
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-sla",
        "path": "spec.sla",
        "type": "object",
        "required": false,
        "description": "SLA defines service-level agreement targets that drive profiling optimization."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-workload",
        "path": "spec.workload",
        "type": "object",
        "required": false,
        "description": "Workload defines the expected workload characteristics for SLA-based profiling."
      },
      {
        "id": "field-nvidia-com-v1beta1-status",
        "path": "status",
        "type": "object",
        "required": false,
        "description": "Status reflects the current observed state of this deployment request."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-conditions",
        "path": "status.conditions",
        "type": "array<object>",
        "required": false,
        "description": "Conditions contains the latest observed conditions of the deployment request.\nStandard condition types include: Succeeded, Validation, Profiling, SpecGenerated, DeploymentReady.",
        "metadata": [
          "x-kubernetes-list-type: map",
          "x-kubernetes-list-map-keys: type"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-deploymentinfo",
        "path": "status.deploymentInfo",
        "type": "object",
        "required": false,
        "description": "DeploymentInfo tracks the state of the deployed DynamoGraphDeployment.\nPopulated when a DGD has been created (either via autoApply or manually)."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-dgdname",
        "path": "status.dgdName",
        "type": "string",
        "required": false,
        "description": "DGDName is the name of the generated or created DynamoGraphDeployment."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-observedgeneration",
        "path": "status.observedGeneration",
        "type": "integer/int64",
        "required": false,
        "description": "ObservedGeneration is the most recent generation observed by the controller.",
        "metadata": [
          "format: int64"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-phase",
        "path": "status.phase",
        "type": "string",
        "required": false,
        "description": "Phase is the high-level lifecycle phase of the deployment request.",
        "metadata": [
          "enum: \"Pending\" | \"Profiling\" | \"Ready\" | \"Deploying\" | \"Deployed\" | \"Failed\""
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-profilingjobname",
        "path": "status.profilingJobName",
        "type": "string",
        "required": false,
        "description": "ProfilingJobName is the name of the Kubernetes Job running the profiler."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-profilingphase",
        "path": "status.profilingPhase",
        "type": "string",
        "required": false,
        "description": "ProfilingPhase indicates the current sub-phase of the profiling pipeline.\nOnly meaningful when Phase is \"Profiling\". Cleared when profiling completes or fails.",
        "metadata": [
          "enum: \"Initializing\" | \"SweepingPrefill\" | \"SweepingDecode\" | \"SelectingConfig\" | \"BuildingCurves\" | \"GeneratingDGD\" | \"Done\""
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-profilingresults",
        "path": "status.profilingResults",
        "type": "object",
        "required": false,
        "description": "ProfilingResults contains the output of the profiling process including\nPareto-optimal configurations and the selected deployment configuration."
      }
    ],
    "truncated": true,
    "truncationDepth": 1
  },
  {
    "apiVersion": "nvidia.com/v1alpha1",
    "group": "nvidia.com",
    "version": "v1alpha1",
    "kind": "DynamoGraphDeploymentRequest",
    "resource": "dynamographdeploymentrequests",
    "lines": [
      {
        "index": 0,
        "text": "apiVersion: nvidia.com/v1alpha1",
        "description": "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        "depth": 0,
        "field": "apiVersion",
        "path": "apiVersion",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-apiversion"
      },
      {
        "index": 1,
        "text": "kind: DynamoGraphDeploymentRequest",
        "description": "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        "depth": 0,
        "field": "kind",
        "path": "kind",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-kind"
      },
      {
        "index": 2,
        "text": "metadata:",
        "description": "Standard Kubernetes object metadata.",
        "depth": 0,
        "field": "metadata",
        "path": "metadata",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata"
      },
      {
        "index": 4,
        "text": "  name: \"<string>\" # required",
        "description": "Name must be unique within a namespace.",
        "depth": 1,
        "field": "name",
        "path": "metadata.name",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-name"
      },
      {
        "index": 7,
        "text": "  namespace: \"<string>\" # required",
        "description": "Namespace defines the space within which each name must be unique.",
        "depth": 1,
        "field": "namespace",
        "path": "metadata.namespace",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-namespace"
      },
      {
        "index": 10,
        "text": "  # annotations:",
        "description": "Annotations is an unstructured key value map stored with a resource.",
        "depth": 1,
        "field": "annotations",
        "path": "metadata.annotations",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-annotations"
      },
      {
        "index": 14,
        "text": "  # creationTimestamp: \"<string>\"",
        "description": "CreationTimestamp is set by the server when a resource is created.",
        "depth": 1,
        "field": "creationTimestamp",
        "path": "metadata.creationTimestamp",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-creationtimestamp"
      },
      {
        "index": 17,
        "text": "  # deletionGracePeriodSeconds: <int64>",
        "description": "Number of seconds allowed for graceful deletion.",
        "depth": 1,
        "field": "deletionGracePeriodSeconds",
        "path": "metadata.deletionGracePeriodSeconds",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-deletiongraceperiodseconds"
      },
      {
        "index": 20,
        "text": "  # deletionTimestamp: \"<string>\"",
        "description": "DeletionTimestamp is set by the server when graceful deletion is requested.",
        "depth": 1,
        "field": "deletionTimestamp",
        "path": "metadata.deletionTimestamp",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-deletiontimestamp"
      },
      {
        "index": 23,
        "text": "  # finalizers:",
        "description": "Finalizers must be empty before the object is deleted from the registry.",
        "depth": 1,
        "field": "finalizers",
        "path": "metadata.finalizers",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-finalizers"
      },
      {
        "index": 28,
        "text": "  # generateName: \"<string>\"",
        "description": "GenerateName is an optional prefix used by the server to generate a unique name.",
        "depth": 1,
        "field": "generateName",
        "path": "metadata.generateName",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-generatename"
      },
      {
        "index": 31,
        "text": "  # generation: <int64>",
        "description": "Generation is a sequence number representing a specific desired state.",
        "depth": 1,
        "field": "generation",
        "path": "metadata.generation",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-generation"
      },
      {
        "index": 34,
        "text": "  # labels:",
        "description": "Labels are key value pairs used to organize and select objects.",
        "depth": 1,
        "field": "labels",
        "path": "metadata.labels",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-labels"
      },
      {
        "index": 38,
        "text": "  # managedFields:",
        "description": "ManagedFields records which actor manages which fields.",
        "depth": 1,
        "field": "managedFields",
        "path": "metadata.managedFields",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields"
      },
      {
        "index": 62,
        "text": "  ownerReferences: # optional",
        "description": "OwnerReferences lists objects depended on by this object.",
        "depth": 1,
        "field": "ownerReferences",
        "path": "metadata.ownerReferences",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences"
      },
      {
        "index": 82,
        "text": "  # resourceVersion: \"<string>\"",
        "description": "ResourceVersion is an opaque internal version value.",
        "depth": 1,
        "field": "resourceVersion",
        "path": "metadata.resourceVersion",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-resourceversion"
      },
      {
        "index": 85,
        "text": "  # selfLink: \"<string>\"",
        "description": "SelfLink is a deprecated read-only field.",
        "depth": 1,
        "field": "selfLink",
        "path": "metadata.selfLink",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-selflink"
      },
      {
        "index": 88,
        "text": "  # uid: \"<string>\"",
        "description": "UID is the unique in time and space value for this object.",
        "depth": 1,
        "field": "uid",
        "path": "metadata.uid",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-uid"
      },
      {
        "index": 90,
        "text": "spec: # optional",
        "description": "Spec defines the desired state for this deployment request.",
        "depth": 0,
        "field": "spec",
        "path": "spec",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec"
      },
      {
        "index": 95,
        "text": "  backend: \"auto\" # required, enum: \"vllm\" | \"sglang\" | \"trtllm\"",
        "description": "Backend specifies the inference backend for profiling.\nThe controller automatically sets this value in profilingConfig.config.engine.backend.\nProfiling runs on real GPUs or via AIC simulation to collect performance data.",
        "depth": 1,
        "field": "backend",
        "path": "spec.backend",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-backend"
      },
      {
        "index": 101,
        "text": "  model: \"<string>\" # required",
        "description": "Model specifies the model to deploy (e.g., \"Qwen/Qwen3-0.6B\", \"meta-llama/Llama-3-70b\").\nThis is a high-level identifier for easy reference in kubectl output and logs.\nThe controller automatically sets this value in profilingConfig.config.deployment.model.",
        "depth": 1,
        "field": "model",
        "path": "spec.model",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-model"
      },
      {
        "index": 116,
        "text": "  profilingConfig: # required",
        "description": "ProfilingConfig provides the complete configuration for the profiling job.\nNote: GPU discovery is automatically attempted to detect GPU resources from Kubernetes\ncluster nodes. If the operator has node read permissions (cluster-wide or explicitly granted),\ndiscovered GPU configuration is used as defaults when hardware configuration is not manually\nspecified (minNumGpusPerEngine, maxNumGpusPerEngine, numGpusPerNode). User-specified values\nalways take precedence over auto-discovered values. If GPU discovery fails (e.g.,\nnamespace-restricted operator without node permissions), manual hardware config is required.\nThis configuration is passed directly to the profiler.\nThe structure matches the profile_sla config format exactly (see ProfilingConfigSpec for schema).\nNote: deployment.model and engine.backend are automatically set from the high-level\nmodelName and backend fields and should not be specified in this config.",
        "depth": 1,
        "field": "profilingConfig",
        "path": "spec.profilingConfig",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-profilingconfig"
      },
      {
        "index": 224,
        "text": "  # autoApply: false # default",
        "description": "AutoApply indicates whether to automatically create a DynamoGraphDeployment\nafter profiling completes. If false, only the spec is generated and stored in status.\nUsers can then manually create a DGD using the generated spec.",
        "depth": 1,
        "field": "autoApply",
        "path": "spec.autoApply",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-autoapply"
      },
      {
        "index": 228,
        "text": "  # deploymentOverrides:",
        "description": "DeploymentOverrides allows customizing metadata for the auto-created DGD.\nOnly applicable when AutoApply is true.",
        "depth": 1,
        "field": "deploymentOverrides",
        "path": "spec.deploymentOverrides",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-deploymentoverrides"
      },
      {
        "index": 261,
        "text": "  # enableGpuDiscovery: true # default",
        "description": "EnableGPUDiscovery controls whether the operator attempts to discover GPU hardware from cluster nodes.\nDEPRECATED: This field is deprecated and will be removed in v1beta1. GPU discovery is now always\nattempted automatically. Setting this field has no effect - the operator will always try to discover\nGPU hardware when node read permissions are available. If discovery is unavailable (e.g., namespace-scoped\noperator without permissions), manual hardware configuration is required regardless of this setting.",
        "depth": 1,
        "field": "enableGpuDiscovery",
        "path": "spec.enableGpuDiscovery",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-enablegpudiscovery"
      },
      {
        "index": 269,
        "text": "  # useMocker: false # default",
        "description": "UseMocker indicates whether to deploy a mocker DynamoGraphDeployment instead of\na real backend deployment. When true, the deployment uses simulated engines that\ndon't require GPUs, using the profiling data to simulate realistic timing behavior.\nMocker is available in all backend images and useful for large-scale experiments.\nProfiling still runs against the real backend (specified above) to collect performance data.",
        "depth": 1,
        "field": "useMocker",
        "path": "spec.useMocker",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-usemocker"
      },
      {
        "index": 272,
        "text": "status: # optional",
        "description": "Status reflects the current observed state of this deployment request.",
        "depth": 0,
        "field": "status",
        "path": "status",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-status"
      },
      {
        "index": 274,
        "text": "  state: \"Initializing\" # default, required, enum: \"Pending\" | \"Profiling\" |",
        "description": "State is a high-level textual status of the deployment request lifecycle.",
        "depth": 1,
        "field": "state",
        "path": "status.state",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-status-state"
      },
      {
        "index": 280,
        "text": "  # backend: \"<string>\"",
        "description": "Backend is extracted from profilingConfig.config.engine.backend for display purposes.\nThis field is populated by the controller and shown in kubectl output.",
        "depth": 1,
        "field": "backend",
        "path": "status.backend",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-backend"
      },
      {
        "index": 286,
        "text": "  conditions: # optional",
        "description": "Conditions contains the latest observed conditions of the deployment request.\nStandard condition types include: Validation, Profiling, SpecGenerated, DeploymentReady.\nConditions are merged by type on patch updates.",
        "depth": 1,
        "field": "conditions",
        "path": "status.conditions",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions"
      },
      {
        "index": 319,
        "text": "  deployment: # optional",
        "description": "Deployment tracks the auto-created DGD when AutoApply is true.\nContains name, namespace, state, and creation status of the managed DGD.",
        "depth": 1,
        "field": "deployment",
        "path": "status.deployment",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-deployment"
      },
      {
        "index": 340,
        "text": "  # generatedDeployment: {} # preserveUnknownFields, embeddedResource",
        "description": "GeneratedDeployment contains the full generated DynamoGraphDeployment specification\nincluding metadata, based on profiling results. Users can extract this to create\na DGD manually, or it's used automatically when autoApply is true.\nStored as RawExtension to preserve all fields including metadata.\nFor mocker backends, this contains the mocker DGD spec.",
        "depth": 1,
        "field": "generatedDeployment",
        "path": "status.generatedDeployment",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-generateddeployment"
      },
      {
        "index": 345,
        "text": "  # observedGeneration: <int64>",
        "description": "ObservedGeneration reflects the generation of the most recently observed spec.\nUsed to detect spec changes and enforce immutability after profiling starts.",
        "depth": 1,
        "field": "observedGeneration",
        "path": "status.observedGeneration",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-observedgeneration"
      },
      {
        "index": 349,
        "text": "  # profilingResults: \"<string>\"",
        "description": "ProfilingResults contains a reference to the ConfigMap holding profiling data.\nFormat: \"configmap/\\<name\\>\"",
        "depth": 1,
        "field": "profilingResults",
        "path": "status.profilingResults",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-profilingresults"
      }
    ],
    "fields": [
      {
        "id": "field-nvidia-com-v1alpha1-apiversion",
        "path": "apiVersion",
        "type": "string",
        "required": true,
        "description": "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources"
      },
      {
        "id": "field-nvidia-com-v1alpha1-kind",
        "path": "kind",
        "type": "string",
        "required": true,
        "description": "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds"
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata",
        "path": "metadata",
        "type": "object",
        "required": true,
        "description": "Standard Kubernetes object metadata.",
        "metadata": [
          "requiredFields: name, namespace"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-annotations",
        "path": "metadata.annotations",
        "type": "object",
        "required": false,
        "description": "Annotations is an unstructured key value map stored with a resource."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-creationtimestamp",
        "path": "metadata.creationTimestamp",
        "type": "string/date-time",
        "required": false,
        "description": "CreationTimestamp is set by the server when a resource is created.",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-deletiongraceperiodseconds",
        "path": "metadata.deletionGracePeriodSeconds",
        "type": "integer/int64",
        "required": false,
        "description": "Number of seconds allowed for graceful deletion.",
        "metadata": [
          "format: int64"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-deletiontimestamp",
        "path": "metadata.deletionTimestamp",
        "type": "string/date-time",
        "required": false,
        "description": "DeletionTimestamp is set by the server when graceful deletion is requested.",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-finalizers",
        "path": "metadata.finalizers",
        "type": "array<string>",
        "required": false,
        "description": "Finalizers must be empty before the object is deleted from the registry."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-generatename",
        "path": "metadata.generateName",
        "type": "string",
        "required": false,
        "description": "GenerateName is an optional prefix used by the server to generate a unique name."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-generation",
        "path": "metadata.generation",
        "type": "integer/int64",
        "required": false,
        "description": "Generation is a sequence number representing a specific desired state.",
        "metadata": [
          "format: int64"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-labels",
        "path": "metadata.labels",
        "type": "object",
        "required": false,
        "description": "Labels are key value pairs used to organize and select objects."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-managedfields",
        "path": "metadata.managedFields",
        "type": "array<object>",
        "required": false,
        "description": "ManagedFields records which actor manages which fields."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-name",
        "path": "metadata.name",
        "type": "string",
        "required": true,
        "description": "Name must be unique within a namespace."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-namespace",
        "path": "metadata.namespace",
        "type": "string",
        "required": true,
        "description": "Namespace defines the space within which each name must be unique."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-ownerreferences",
        "path": "metadata.ownerReferences",
        "type": "array<object>",
        "required": false,
        "description": "OwnerReferences lists objects depended on by this object."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-resourceversion",
        "path": "metadata.resourceVersion",
        "type": "string",
        "required": false,
        "description": "ResourceVersion is an opaque internal version value."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-selflink",
        "path": "metadata.selfLink",
        "type": "string",
        "required": false,
        "description": "SelfLink is a deprecated read-only field."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-uid",
        "path": "metadata.uid",
        "type": "string",
        "required": false,
        "description": "UID is the unique in time and space value for this object."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec",
        "path": "spec",
        "type": "object",
        "required": false,
        "description": "Spec defines the desired state for this deployment request.",
        "metadata": [
          "requiredFields: backend, model, profilingConfig"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-autoapply",
        "path": "spec.autoApply",
        "type": "boolean",
        "required": false,
        "description": "AutoApply indicates whether to automatically create a DynamoGraphDeployment\nafter profiling completes. If false, only the spec is generated and stored in status.\nUsers can then manually create a DGD using the generated spec.",
        "metadata": [
          "default: false"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-backend",
        "path": "spec.backend",
        "type": "string",
        "required": true,
        "description": "Backend specifies the inference backend for profiling.\nThe controller automatically sets this value in profilingConfig.config.engine.backend.\nProfiling runs on real GPUs or via AIC simulation to collect performance data.",
        "metadata": [
          "enum: \"auto\" | \"vllm\" | \"sglang\" | \"trtllm\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-deploymentoverrides",
        "path": "spec.deploymentOverrides",
        "type": "object",
        "required": false,
        "description": "DeploymentOverrides allows customizing metadata for the auto-created DGD.\nOnly applicable when AutoApply is true."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-enablegpudiscovery",
        "path": "spec.enableGpuDiscovery",
        "type": "boolean",
        "required": false,
        "description": "EnableGPUDiscovery controls whether the operator attempts to discover GPU hardware from cluster nodes.\nDEPRECATED: This field is deprecated and will be removed in v1beta1. GPU discovery is now always\nattempted automatically. Setting this field has no effect - the operator will always try to discover\nGPU hardware when node read permissions are available. If discovery is unavailable (e.g., namespace-scoped\noperator without permissions), manual hardware configuration is required regardless of this setting.",
        "metadata": [
          "default: true"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-model",
        "path": "spec.model",
        "type": "string",
        "required": true,
        "description": "Model specifies the model to deploy (e.g., \"Qwen/Qwen3-0.6B\", \"meta-llama/Llama-3-70b\").\nThis is a high-level identifier for easy reference in kubectl output and logs.\nThe controller automatically sets this value in profilingConfig.config.deployment.model."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-profilingconfig",
        "path": "spec.profilingConfig",
        "type": "object",
        "required": true,
        "description": "ProfilingConfig provides the complete configuration for the profiling job.\nNote: GPU discovery is automatically attempted to detect GPU resources from Kubernetes\ncluster nodes. If the operator has node read permissions (cluster-wide or explicitly granted),\ndiscovered GPU configuration is used as defaults when hardware configuration is not manually\nspecified (minNumGpusPerEngine, maxNumGpusPerEngine, numGpusPerNode). User-specified values\nalways take precedence over auto-discovered values. If GPU discovery fails (e.g.,\nnamespace-restricted operator without node permissions), manual hardware config is required.\nThis configuration is passed directly to the profiler.\nThe structure matches the profile_sla config format exactly (see ProfilingConfigSpec for schema).\nNote: deployment.model and engine.backend are automatically set from the high-level\nmodelName and backend fields and should not be specified in this config.",
        "metadata": [
          "requiredFields: profilerImage"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-usemocker",
        "path": "spec.useMocker",
        "type": "boolean",
        "required": false,
        "description": "UseMocker indicates whether to deploy a mocker DynamoGraphDeployment instead of\na real backend deployment. When true, the deployment uses simulated engines that\ndon't require GPUs, using the profiling data to simulate realistic timing behavior.\nMocker is available in all backend images and useful for large-scale experiments.\nProfiling still runs against the real backend (specified above) to collect performance data.",
        "metadata": [
          "default: false"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status",
        "path": "status",
        "type": "object",
        "required": false,
        "description": "Status reflects the current observed state of this deployment request.",
        "metadata": [
          "requiredFields: state"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-backend",
        "path": "status.backend",
        "type": "string",
        "required": false,
        "description": "Backend is extracted from profilingConfig.config.engine.backend for display purposes.\nThis field is populated by the controller and shown in kubectl output."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions",
        "path": "status.conditions",
        "type": "array<object>",
        "required": false,
        "description": "Conditions contains the latest observed conditions of the deployment request.\nStandard condition types include: Validation, Profiling, SpecGenerated, DeploymentReady.\nConditions are merged by type on patch updates."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-deployment",
        "path": "status.deployment",
        "type": "object",
        "required": false,
        "description": "Deployment tracks the auto-created DGD when AutoApply is true.\nContains name, namespace, state, and creation status of the managed DGD.",
        "metadata": [
          "requiredFields: state"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-generateddeployment",
        "path": "status.generatedDeployment",
        "type": "object",
        "required": false,
        "description": "GeneratedDeployment contains the full generated DynamoGraphDeployment specification\nincluding metadata, based on profiling results. Users can extract this to create\na DGD manually, or it's used automatically when autoApply is true.\nStored as RawExtension to preserve all fields including metadata.\nFor mocker backends, this contains the mocker DGD spec.",
        "metadata": [
          "x-kubernetes-preserve-unknown-fields",
          "x-kubernetes-embedded-resource"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-observedgeneration",
        "path": "status.observedGeneration",
        "type": "integer/int64",
        "required": false,
        "description": "ObservedGeneration reflects the generation of the most recently observed spec.\nUsed to detect spec changes and enforce immutability after profiling starts.",
        "metadata": [
          "format: int64"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-profilingresults",
        "path": "status.profilingResults",
        "type": "string",
        "required": false,
        "description": "ProfilingResults contains a reference to the ConfigMap holding profiling data.\nFormat: \"configmap/\\<name\\>\""
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-state",
        "path": "status.state",
        "type": "string",
        "required": true,
        "description": "State is a high-level textual status of the deployment request lifecycle.",
        "metadata": [
          "default: \"Initializing\"",
          "enum: \"Initializing\" | \"Pending\" | \"Profiling\" | \"Deploying\" | \"Ready\" | \"DeploymentDeleted\" | \"Failed\""
        ]
      }
    ],
    "truncated": true,
    "truncationDepth": 1
  }
];

export function DynamoGraphDeploymentRequestSchema0() {
  return <KubeSchemaDoc data={kubectlDocSchemas[0]} filtering={true} />;
}

export function DynamoGraphDeploymentRequestSchema1() {
  return <KubeSchemaDoc data={kubectlDocSchemas[1]} filtering={true} />;
}
