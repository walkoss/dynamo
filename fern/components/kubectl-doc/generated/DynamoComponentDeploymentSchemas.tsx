"use client";

import { KubeSchemaDoc } from "@/components/kubectl-doc/KubeSchemaDoc";

const kubectlDocSchemas = [
  {
    "apiVersion": "nvidia.com/v1beta1",
    "group": "nvidia.com",
    "version": "v1beta1",
    "kind": "DynamoComponentDeployment",
    "resource": "dynamocomponentdeployments",
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
        "text": "kind: DynamoComponentDeployment",
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
        "description": "spec defines the desired state for this Dynamo component deployment.",
        "depth": 0,
        "field": "spec",
        "path": "spec",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-spec"
      },
      {
        "index": 92,
        "text": "  # backendFramework: \"sglang\" # enum: \"vllm\" | \"trtllm\"",
        "description": "backendFramework specifies the backend framework.",
        "depth": 1,
        "field": "backendFramework",
        "path": "spec.backendFramework",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-backendframework"
      },
      {
        "index": 98,
        "text": "  compilationCache: # optional",
        "description": "compilationCache configures a PVC-backed compilation cache. The operator\nhandles backend-specific mount paths and environment variables, so\nusers do not need to hand-wire them into `podTemplate`. Extracted from\nv1alpha1's `volumeMount.useAsCompilationCache` flag.",
        "depth": 1,
        "field": "compilationCache",
        "path": "spec.compilationCache",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-compilationcache"
      },
      {
        "index": 109,
        "text": "  eppConfig: # optional",
        "description": "eppConfig holds EPP-specific configuration for Endpoint Picker Plugin\ncomponents. Only meaningful when `type` is `epp`.",
        "depth": 1,
        "field": "eppConfig",
        "path": "spec.eppConfig",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-eppconfig"
      },
      {
        "index": 205,
        "text": "  experimental: # optional",
        "description": "experimental groups opt-in preview features whose API shape and\nbehavior may change in breaking ways between v1beta1 releases,\nincluding disappearing without a name-preserving graduation path.\nIn v1beta1 this block holds `gpuMemoryService` and `failover` (which\nremain tightly coupled -- failover requires GMS -- and are expected to\nevolve together as the DRA-based GPU sharing story matures), and\n`checkpoint` (whose interaction with the standalone DynamoCheckpoint\nresource and identity-hash computation is still settling). Fields here\nare explicitly NOT covered by the normal v1beta1 deprecation policy;\ndo not depend on them for production workloads.",
        "depth": 1,
        "field": "experimental",
        "path": "spec.experimental",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-experimental"
      },
      {
        "index": 323,
        "text": "  # frontendSidecar: \"<string>\"",
        "description": "frontendSidecar optionally designates a container in\n`podTemplate.spec.containers` as the frontend sidecar. The value must\nmatch the `name` of a container in that list; the operator merges its\nfrontend-sidecar defaults (auto-generated Dynamo env vars, ports,\nhealth probes) into that container the same way it merges into `\"main\"`.\nThe full container definition (image, args, envFrom, env) lives in\n`podTemplate` -- this eliminates the redundant `image`, `args`,\n`envFromSecret`, and `envs` fields from v1alpha1's `FrontendSidecarSpec`.\nThe validation webhook rejects values that do not match any container\nname in `podTemplate.spec.containers`.",
        "depth": 1,
        "field": "frontendSidecar",
        "path": "spec.frontendSidecar",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-frontendsidecar"
      },
      {
        "index": 327,
        "text": "  # globalDynamoNamespace: <boolean>",
        "description": "globalDynamoNamespace places the component in the global Dynamo\nnamespace rather than the per-deployment namespace derived from the\nDGD name.",
        "depth": 1,
        "field": "globalDynamoNamespace",
        "path": "spec.globalDynamoNamespace",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-globaldynamonamespace"
      },
      {
        "index": 331,
        "text": "  modelRef: # optional",
        "description": "modelRef references a model served by this component. When specified,\na headless service is created for endpoint discovery.",
        "depth": 1,
        "field": "modelRef",
        "path": "spec.modelRef",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-modelref"
      },
      {
        "index": 339,
        "text": "  # multinode:",
        "description": "multinode configures multinode components.",
        "depth": 1,
        "field": "multinode",
        "path": "spec.multinode",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-multinode"
      },
      {
        "index": 357,
        "text": "  # name: \"<string>\" # minLength: 1, maxLength: 63",
        "description": "name is the stable logical identifier for this component within its\nDynamoGraphDeployment. It must be unique within the parent's\n`spec.components` list.\n\nFor standalone DynamoComponentDeployment objects, the defaulting webhook\npopulates `name` from `metadata.name` on admission, so users\ntypically do not need to set it explicitly.\n\n`name` is decoupled from the underlying Kubernetes resource name so that\nthe operator can rename child workloads (e.g. suffixing worker DCDs with\na hash during rolling updates) without losing the stable identity that\ndownstream consumers (labels, status maps, DGDSA references, planner\nRBAC, EPP filters) depend on.",
        "depth": 1,
        "field": "name",
        "path": "spec.name",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-name"
      },
      {
        "index": 369,
        "text": "  podTemplate: # optional",
        "description": "podTemplate is the pod template used to create the component's pods.\nThe operator injects its defaults (image, command, env, ports, probes,\nresources, volume mounts) into the container named `\"main\"` inside\n`podTemplate.spec.containers`, merging user overrides by name. If no\ncontainer named `\"main\"` is present, the operator auto-generates it\nwith standard defaults. All other containers in `podTemplate.spec.containers`\nare treated as user-managed sidecars: the operator does not inject\ndefaults into them, so sidecars must specify required fields (e.g. `image`)\nthemselves. The validation webhook rejects pod templates where a\nnon-`\"main\"` container is missing a required field such as `image`.",
        "depth": 1,
        "field": "podTemplate",
        "path": "spec.podTemplate",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-podtemplate"
      },
      {
        "index": 6219,
        "text": "  # replicas: <int32> # minimum: 0",
        "description": "replicas is the desired number of Pods for this component. When\n`scalingAdapter` is set on this component, this field is managed by\nthe DynamoGraphDeploymentScalingAdapter and should not be modified\ndirectly.",
        "depth": 1,
        "field": "replicas",
        "path": "spec.replicas",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-replicas"
      },
      {
        "index": 6226,
        "text": "  # scalingAdapter: {}",
        "description": "scalingAdapter opts this component into using the\nDynamoGraphDeploymentScalingAdapter. When set (even as an empty object,\n`scalingAdapter: {}`), a DGDSA is created and owns the `replicas` field\nso that external autoscalers (HPA/KEDA/Planner) can drive scaling via\nthe Scale subresource. Omit the field to opt out.",
        "depth": 1,
        "field": "scalingAdapter",
        "path": "spec.scalingAdapter",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-scalingadapter"
      },
      {
        "index": 6233,
        "text": "  # sharedMemorySize: <int-or-string> # intOrString",
        "description": "sharedMemorySize controls the size of the tmpfs mounted at `/dev/shm`.\n`nil` selects the operator default (8Gi), a positive quantity sets a\ncustom size, and `\"0\"` disables the shared-memory volume entirely.\nSimpler replacement for v1alpha1's `SharedMemorySpec` struct with its\n`disabled bool` + `size Quantity` pattern.",
        "depth": 1,
        "field": "sharedMemorySize",
        "path": "spec.sharedMemorySize",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-sharedmemorysize"
      },
      {
        "index": 6239,
        "text": "  topologyConstraint: # optional",
        "description": "topologyConstraint applies to this component.\n`topologyConstraint.packDomain` is required. When both this and\n`spec.topologyConstraint.packDomain` are set, this field's `packDomain`\nmust be narrower than or equal to the spec-level value.",
        "depth": 1,
        "field": "topologyConstraint",
        "path": "spec.topologyConstraint",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-topologyconstraint"
      },
      {
        "index": 6248,
        "text": "  # type: \"frontend\" # enum: \"worker\" | \"prefill\" | \"decode\" | \"planner\" | \"epp\"",
        "description": "type indicates the role of this component within a Dynamo graph. Drives\nport mapping, frontend detection, planner RBAC, and the pod label\n`nvidia.com/dynamo-component-type`. Because `prefill` and `decode` are\nfirst-class values, users can set them directly.",
        "depth": 1,
        "field": "type",
        "path": "spec.type",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-type"
      },
      {
        "index": 6251,
        "text": "status: # optional",
        "description": "status reflects the current observed state of the component deployment.",
        "depth": 0,
        "field": "status",
        "path": "status",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1beta1-status"
      },
      {
        "index": 6253,
        "text": "  component: # optional",
        "description": "component contains replica status information for this component.",
        "depth": 1,
        "field": "component",
        "path": "status.component",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-component"
      },
      {
        "index": 6284,
        "text": "  conditions: # optional, listType: map, listMapKeys: type",
        "description": "conditions captures the latest observed state of the component using\nstandard Kubernetes condition types (including `Available` and\n`DynamoComponentReady`).",
        "depth": 1,
        "field": "conditions",
        "path": "status.conditions",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-conditions"
      },
      {
        "index": 6316,
        "text": "  # observedGeneration: <int64>",
        "description": "observedGeneration is the most recent generation observed by the controller.",
        "depth": 1,
        "field": "observedGeneration",
        "path": "status.observedGeneration",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-observedgeneration"
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
        "description": "spec defines the desired state for this Dynamo component deployment.",
        "metadata": [
          "x-kubernetes-validations[0].rule: !has(self.eppConfig) || (has(self.type) && self.type == 'epp')",
          "x-kubernetes-validations[0].message: eppConfig may only be set when type is epp"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-backendframework",
        "path": "spec.backendFramework",
        "type": "string",
        "required": false,
        "description": "backendFramework specifies the backend framework.",
        "metadata": [
          "enum: \"sglang\" | \"vllm\" | \"trtllm\""
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-compilationcache",
        "path": "spec.compilationCache",
        "type": "object",
        "required": false,
        "description": "compilationCache configures a PVC-backed compilation cache. The operator\nhandles backend-specific mount paths and environment variables, so\nusers do not need to hand-wire them into `podTemplate`. Extracted from\nv1alpha1's `volumeMount.useAsCompilationCache` flag.",
        "metadata": [
          "requiredFields: pvcName"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-eppconfig",
        "path": "spec.eppConfig",
        "type": "object",
        "required": false,
        "description": "eppConfig holds EPP-specific configuration for Endpoint Picker Plugin\ncomponents. Only meaningful when `type` is `epp`.",
        "metadata": [
          "x-kubernetes-validations[0].rule: has(self.configMapRef) != has(self.config)",
          "x-kubernetes-validations[0].message: exactly one of configMapRef or config must be specified"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-experimental",
        "path": "spec.experimental",
        "type": "object",
        "required": false,
        "description": "experimental groups opt-in preview features whose API shape and\nbehavior may change in breaking ways between v1beta1 releases,\nincluding disappearing without a name-preserving graduation path.\nIn v1beta1 this block holds `gpuMemoryService` and `failover` (which\nremain tightly coupled -- failover requires GMS -- and are expected to\nevolve together as the DRA-based GPU sharing story matures), and\n`checkpoint` (whose interaction with the standalone DynamoCheckpoint\nresource and identity-hash computation is still settling). Fields here\nare explicitly NOT covered by the normal v1beta1 deprecation policy;\ndo not depend on them for production workloads."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-frontendsidecar",
        "path": "spec.frontendSidecar",
        "type": "string",
        "required": false,
        "description": "frontendSidecar optionally designates a container in\n`podTemplate.spec.containers` as the frontend sidecar. The value must\nmatch the `name` of a container in that list; the operator merges its\nfrontend-sidecar defaults (auto-generated Dynamo env vars, ports,\nhealth probes) into that container the same way it merges into `\"main\"`.\nThe full container definition (image, args, envFrom, env) lives in\n`podTemplate` -- this eliminates the redundant `image`, `args`,\n`envFromSecret`, and `envs` fields from v1alpha1's `FrontendSidecarSpec`.\nThe validation webhook rejects values that do not match any container\nname in `podTemplate.spec.containers`."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-globaldynamonamespace",
        "path": "spec.globalDynamoNamespace",
        "type": "boolean",
        "required": false,
        "description": "globalDynamoNamespace places the component in the global Dynamo\nnamespace rather than the per-deployment namespace derived from the\nDGD name."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-modelref",
        "path": "spec.modelRef",
        "type": "object",
        "required": false,
        "description": "modelRef references a model served by this component. When specified,\na headless service is created for endpoint discovery.",
        "metadata": [
          "requiredFields: name"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-multinode",
        "path": "spec.multinode",
        "type": "object",
        "required": false,
        "description": "multinode configures multinode components."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-name",
        "path": "spec.name",
        "type": "string",
        "required": false,
        "description": "name is the stable logical identifier for this component within its\nDynamoGraphDeployment. It must be unique within the parent's\n`spec.components` list.\n\nFor standalone DynamoComponentDeployment objects, the defaulting webhook\npopulates `name` from `metadata.name` on admission, so users\ntypically do not need to set it explicitly.\n\n`name` is decoupled from the underlying Kubernetes resource name so that\nthe operator can rename child workloads (e.g. suffixing worker DCDs with\na hash during rolling updates) without losing the stable identity that\ndownstream consumers (labels, status maps, DGDSA references, planner\nRBAC, EPP filters) depend on.",
        "metadata": [
          "minLength: 1",
          "maxLength: 63",
          "pattern: ^[A-Za-z0-9]([-A-Za-z0-9]*[A-Za-z0-9])?$"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-podtemplate",
        "path": "spec.podTemplate",
        "type": "object",
        "required": false,
        "description": "podTemplate is the pod template used to create the component's pods.\nThe operator injects its defaults (image, command, env, ports, probes,\nresources, volume mounts) into the container named `\"main\"` inside\n`podTemplate.spec.containers`, merging user overrides by name. If no\ncontainer named `\"main\"` is present, the operator auto-generates it\nwith standard defaults. All other containers in `podTemplate.spec.containers`\nare treated as user-managed sidecars: the operator does not inject\ndefaults into them, so sidecars must specify required fields (e.g. `image`)\nthemselves. The validation webhook rejects pod templates where a\nnon-`\"main\"` container is missing a required field such as `image`."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-replicas",
        "path": "spec.replicas",
        "type": "integer/int32",
        "required": false,
        "description": "replicas is the desired number of Pods for this component. When\n`scalingAdapter` is set on this component, this field is managed by\nthe DynamoGraphDeploymentScalingAdapter and should not be modified\ndirectly.",
        "metadata": [
          "format: int32",
          "minimum: 0"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-scalingadapter",
        "path": "spec.scalingAdapter",
        "type": "object",
        "required": false,
        "description": "scalingAdapter opts this component into using the\nDynamoGraphDeploymentScalingAdapter. When set (even as an empty object,\n`scalingAdapter: {}`), a DGDSA is created and owns the `replicas` field\nso that external autoscalers (HPA/KEDA/Planner) can drive scaling via\nthe Scale subresource. Omit the field to opt out."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-sharedmemorysize",
        "path": "spec.sharedMemorySize",
        "type": "int-or-string",
        "required": false,
        "description": "sharedMemorySize controls the size of the tmpfs mounted at `/dev/shm`.\n`nil` selects the operator default (8Gi), a positive quantity sets a\ncustom size, and `\"0\"` disables the shared-memory volume entirely.\nSimpler replacement for v1alpha1's `SharedMemorySpec` struct with its\n`disabled bool` + `size Quantity` pattern.",
        "metadata": [
          "pattern: ^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
          "x-kubernetes-int-or-string"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-topologyconstraint",
        "path": "spec.topologyConstraint",
        "type": "object",
        "required": false,
        "description": "topologyConstraint applies to this component.\n`topologyConstraint.packDomain` is required. When both this and\n`spec.topologyConstraint.packDomain` are set, this field's `packDomain`\nmust be narrower than or equal to the spec-level value.",
        "metadata": [
          "requiredFields: packDomain"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-type",
        "path": "spec.type",
        "type": "string",
        "required": false,
        "description": "type indicates the role of this component within a Dynamo graph. Drives\nport mapping, frontend detection, planner RBAC, and the pod label\n`nvidia.com/dynamo-component-type`. Because `prefill` and `decode` are\nfirst-class values, users can set them directly.",
        "metadata": [
          "enum: \"frontend\" | \"worker\" | \"prefill\" | \"decode\" | \"planner\" | \"epp\""
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status",
        "path": "status",
        "type": "object",
        "required": false,
        "description": "status reflects the current observed state of the component deployment."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-component",
        "path": "status.component",
        "type": "object",
        "required": false,
        "description": "component contains replica status information for this component.",
        "metadata": [
          "requiredFields: componentKind, replicas, updatedReplicas"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-conditions",
        "path": "status.conditions",
        "type": "array<object>",
        "required": false,
        "description": "conditions captures the latest observed state of the component using\nstandard Kubernetes condition types (including `Available` and\n`DynamoComponentReady`).",
        "metadata": [
          "x-kubernetes-list-type: map",
          "x-kubernetes-list-map-keys: type"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-observedgeneration",
        "path": "status.observedGeneration",
        "type": "integer/int64",
        "required": false,
        "description": "observedGeneration is the most recent generation observed by the controller.",
        "metadata": [
          "format: int64"
        ]
      }
    ],
    "truncated": true,
    "truncationDepth": 1
  },
  {
    "apiVersion": "nvidia.com/v1alpha1",
    "group": "nvidia.com",
    "version": "v1alpha1",
    "kind": "DynamoComponentDeployment",
    "resource": "dynamocomponentdeployments",
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
        "text": "kind: DynamoComponentDeployment",
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
        "description": "Spec defines the desired state for this Dynamo component deployment.",
        "depth": 0,
        "field": "spec",
        "path": "spec",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec"
      },
      {
        "index": 93,
        "text": "  # annotations:",
        "description": "Annotations to add to generated Kubernetes resources for this component\n(such as Pod, Service, and Ingress when applicable).",
        "depth": 1,
        "field": "annotations",
        "path": "spec.annotations",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-annotations"
      },
      {
        "index": 100,
        "text": "  autoscaling: # optional",
        "description": "Deprecated: This field is deprecated and ignored. Use DynamoGraphDeploymentScalingAdapter\nwith HPA, KEDA, or Planner for autoscaling instead. See docs/kubernetes/autoscaling.md\nfor migration guidance. This field will be removed in a future API version.",
        "depth": 1,
        "field": "autoscaling",
        "path": "spec.autoscaling",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-autoscaling"
      },
      {
        "index": 476,
        "text": "  # backendFramework: \"sglang\" # enum: \"vllm\" | \"trtllm\"",
        "description": "BackendFramework specifies the backend framework (e.g., \"sglang\", \"vllm\", \"trtllm\")",
        "depth": 1,
        "field": "backendFramework",
        "path": "spec.backendFramework",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-backendframework"
      },
      {
        "index": 480,
        "text": "  checkpoint: # optional",
        "description": "Checkpoint configures container checkpointing for this service.\nWhen enabled, pods can be restored from a checkpoint files for faster cold start.",
        "depth": 1,
        "field": "checkpoint",
        "path": "spec.checkpoint",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-checkpoint"
      },
      {
        "index": 543,
        "text": "  # componentType: \"<string>\"",
        "description": "ComponentType indicates the role of this component (for example, \"main\").",
        "depth": 1,
        "field": "componentType",
        "path": "spec.componentType",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-componenttype"
      },
      {
        "index": 548,
        "text": "  # dynamoNamespace: \"<string>\"",
        "description": "DynamoNamespace is deprecated and will be removed in a future version.\nThe DGD Kubernetes namespace and DynamoGraphDeployment name are used to construct the Dynamo namespace for each component",
        "depth": 1,
        "field": "dynamoNamespace",
        "path": "spec.dynamoNamespace",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-dynamonamespace"
      },
      {
        "index": 552,
        "text": "  # envFromSecret: \"<string>\"",
        "description": "EnvFromSecret references a Secret whose key/value pairs will be exposed as\nenvironment variables in the component containers.",
        "depth": 1,
        "field": "envFromSecret",
        "path": "spec.envFromSecret",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-envfromsecret"
      },
      {
        "index": 556,
        "text": "  envs: # optional",
        "description": "Envs defines additional environment variables to inject into the component containers.",
        "depth": 1,
        "field": "envs",
        "path": "spec.envs",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-envs"
      },
      {
        "index": 656,
        "text": "  eppConfig: # optional",
        "description": "EPPConfig defines EPP-specific configuration options for Endpoint Picker Plugin components.\nOnly applicable when ComponentType is \"epp\".",
        "depth": 1,
        "field": "eppConfig",
        "path": "spec.eppConfig",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-eppconfig"
      },
      {
        "index": 746,
        "text": "  # extraPodMetadata:",
        "description": "ExtraPodMetadata adds labels/annotations to the created Pods.",
        "depth": 1,
        "field": "extraPodMetadata",
        "path": "spec.extraPodMetadata",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-extrapodmetadata"
      },
      {
        "index": 756,
        "text": "  extraPodSpec: # optional",
        "description": "ExtraPodSpec allows to override the main pod spec configuration.\nIt is a k8s standard PodSpec. It also contains a MainContainer (standard k8s Container) field\nthat allows overriding the main container configuration.",
        "depth": 1,
        "field": "extraPodSpec",
        "path": "spec.extraPodSpec",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-extrapodspec"
      },
      {
        "index": 7489,
        "text": "  failover: # optional",
        "description": "Failover configures GMS (GPU Memory Service) failover for this service.\nFor intraPod mode: the main container is cloned into two engine containers (active + standby).\nFor interPod mode: the operator creates a dedicated GMS weight server pod and\nmultiple engine pods per rank that share GPUs via DRA resource claims.",
        "depth": 1,
        "field": "failover",
        "path": "spec.failover",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-failover"
      },
      {
        "index": 7511,
        "text": "  frontendSidecar: # optional",
        "description": "FrontendSidecar configures an auto-generated frontend sidecar container.\nWhen specified, the operator injects a fully configured frontend container\nwith all standard Dynamo environment variables, health probes, and ports.\nThis eliminates the need to manually specify these in extraPodSpec.containers. (GAIE)",
        "depth": 1,
        "field": "frontendSidecar",
        "path": "spec.frontendSidecar",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-frontendsidecar"
      },
      {
        "index": 7630,
        "text": "  # globalDynamoNamespace: <boolean>",
        "description": "GlobalDynamoNamespace indicates that the Component will be placed in the global Dynamo namespace",
        "depth": 1,
        "field": "globalDynamoNamespace",
        "path": "spec.globalDynamoNamespace",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-globaldynamonamespace"
      },
      {
        "index": 7634,
        "text": "  gpuMemoryService: # optional",
        "description": "GPUMemoryService configures the GPU Memory Service (GMS) sidecar.\nWhen enabled, a GMS sidecar is injected and GPU access is managed via DRA.",
        "depth": 1,
        "field": "gpuMemoryService",
        "path": "spec.gpuMemoryService",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-gpumemoryservice"
      },
      {
        "index": 7667,
        "text": "  # ingress:",
        "description": "Ingress config to expose the component outside the cluster (or through a service mesh).",
        "depth": 1,
        "field": "ingress",
        "path": "spec.ingress",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-ingress"
      },
      {
        "index": 7708,
        "text": "  # labels:",
        "description": "Labels to add to generated Kubernetes resources for this component.",
        "depth": 1,
        "field": "labels",
        "path": "spec.labels",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-labels"
      },
      {
        "index": 7712,
        "text": "  livenessProbe: # optional",
        "description": "LivenessProbe to detect and restart unhealthy containers.",
        "depth": 1,
        "field": "livenessProbe",
        "path": "spec.livenessProbe",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-livenessprobe"
      },
      {
        "index": 7808,
        "text": "  modelRef: # optional",
        "description": "ModelRef references a model that this component serves\nWhen specified, a headless service will be created for endpoint discovery",
        "depth": 1,
        "field": "modelRef",
        "path": "spec.modelRef",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-modelref"
      },
      {
        "index": 7816,
        "text": "  multinode: # optional",
        "description": "Multinode is the configuration for multinode components.",
        "depth": 1,
        "field": "multinode",
        "path": "spec.multinode",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-multinode"
      },
      {
        "index": 7822,
        "text": "  readinessProbe: # optional",
        "description": "ReadinessProbe to signal when the container is ready to receive traffic.",
        "depth": 1,
        "field": "readinessProbe",
        "path": "spec.readinessProbe",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-readinessprobe"
      },
      {
        "index": 7919,
        "text": "  # replicas: <int32> # minimum: 0",
        "description": "Replicas is the desired number of Pods for this component.\nWhen scalingAdapter is enabled, this field is managed by the\nDynamoGraphDeploymentScalingAdapter and should not be modified directly.",
        "depth": 1,
        "field": "replicas",
        "path": "spec.replicas",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-replicas"
      },
      {
        "index": 7923,
        "text": "  resources: # optional",
        "description": "Resources requested and limits for this component, including CPU, memory,\nGPUs/devices, and any runtime-specific resources.",
        "depth": 1,
        "field": "resources",
        "path": "spec.resources",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-resources"
      },
      {
        "index": 7980,
        "text": "  # scalingAdapter:",
        "description": "ScalingAdapter configures whether this service uses the DynamoGraphDeploymentScalingAdapter.\nWhen enabled, replicas are managed via DGDSA and external autoscalers can scale\nthe service using the Scale subresource. When disabled, replicas can be modified directly.",
        "depth": 1,
        "field": "scalingAdapter",
        "path": "spec.scalingAdapter",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-scalingadapter"
      },
      {
        "index": 7988,
        "text": "  # serviceName: \"<string>\"",
        "description": "The name of the component",
        "depth": 1,
        "field": "serviceName",
        "path": "spec.serviceName",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-servicename"
      },
      {
        "index": 7992,
        "text": "  # sharedMemory:",
        "description": "SharedMemory controls the tmpfs mounted at /dev/shm (enable/disable and size).",
        "depth": 1,
        "field": "sharedMemory",
        "path": "spec.sharedMemory",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-sharedmemory"
      },
      {
        "index": 8003,
        "text": "  # subComponentType: \"<string>\"",
        "description": "SubComponentType indicates the sub-role of this component (for example, \"prefill\").",
        "depth": 1,
        "field": "subComponentType",
        "path": "spec.subComponentType",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-subcomponenttype"
      },
      {
        "index": 8008,
        "text": "  topologyConstraint: # optional",
        "description": "TopologyConstraint for this service. packDomain is required.\nWhen both this and spec.topologyConstraint.packDomain are set, packDomain\nmust be narrower than or equal to the spec-level packDomain.",
        "depth": 1,
        "field": "topologyConstraint",
        "path": "spec.topologyConstraint",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-topologyconstraint"
      },
      {
        "index": 8015,
        "text": "  volumeMounts: # optional",
        "description": "VolumeMounts references PVCs defined at the top level for volumes to be mounted by the component.",
        "depth": 1,
        "field": "volumeMounts",
        "path": "spec.volumeMounts",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-volumemounts"
      },
      {
        "index": 8030,
        "text": "status: # optional",
        "description": "Status reflects the current observed state of the component deployment.",
        "depth": 0,
        "field": "status",
        "path": "status",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-status"
      },
      {
        "index": 8033,
        "text": "  conditions: # required",
        "description": "Conditions captures the latest observed state of the component (including\navailability and readiness) using standard Kubernetes condition types.",
        "depth": 1,
        "field": "conditions",
        "path": "status.conditions",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions"
      },
      {
        "index": 8065,
        "text": "  # observedGeneration: <int64>",
        "description": "ObservedGeneration is the most recent generation observed by the controller.",
        "depth": 1,
        "field": "observedGeneration",
        "path": "status.observedGeneration",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-observedgeneration"
      },
      {
        "index": 8069,
        "text": "  # podSelector:",
        "description": "PodSelector contains the labels that can be used to select Pods belonging to\nthis component deployment.",
        "depth": 1,
        "field": "podSelector",
        "path": "status.podSelector",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-podselector"
      },
      {
        "index": 8073,
        "text": "  service: # optional",
        "description": "Service contains replica status information for this service.",
        "depth": 1,
        "field": "service",
        "path": "status.service",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-service"
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
        "description": "Spec defines the desired state for this Dynamo component deployment."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-annotations",
        "path": "spec.annotations",
        "type": "object",
        "required": false,
        "description": "Annotations to add to generated Kubernetes resources for this component\n(such as Pod, Service, and Ingress when applicable)."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-autoscaling",
        "path": "spec.autoscaling",
        "type": "object",
        "required": false,
        "description": "Deprecated: This field is deprecated and ignored. Use DynamoGraphDeploymentScalingAdapter\nwith HPA, KEDA, or Planner for autoscaling instead. See docs/kubernetes/autoscaling.md\nfor migration guidance. This field will be removed in a future API version."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-backendframework",
        "path": "spec.backendFramework",
        "type": "string",
        "required": false,
        "description": "BackendFramework specifies the backend framework (e.g., \"sglang\", \"vllm\", \"trtllm\")",
        "metadata": [
          "enum: \"sglang\" | \"vllm\" | \"trtllm\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-checkpoint",
        "path": "spec.checkpoint",
        "type": "object",
        "required": false,
        "description": "Checkpoint configures container checkpointing for this service.\nWhen enabled, pods can be restored from a checkpoint files for faster cold start.",
        "metadata": [
          "x-kubernetes-validations[0].rule: !self.enabled || (has(self.checkpointRef) && size(self.checkpointRef) > 0) || (has(self.identity) && has(self.identity.model) && has(self.identity.backendFramework))",
          "x-kubernetes-validations[0].message: When enabled, either checkpointRef or both identity.model and identity.backendFramework must be specified",
          "x-kubernetes-validations[1].rule: !has(self.job) || !has(self.checkpointRef) || size(self.checkpointRef) == 0",
          "x-kubernetes-validations[1].message: checkpoint.job cannot be set when checkpointRef is specified",
          "x-kubernetes-validations[2].rule: !has(self.job) || !has(self.mode) || self.mode == 'Auto'",
          "x-kubernetes-validations[2].message: checkpoint.job can only be set in Auto mode"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-componenttype",
        "path": "spec.componentType",
        "type": "string",
        "required": false,
        "description": "ComponentType indicates the role of this component (for example, \"main\")."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-dynamonamespace",
        "path": "spec.dynamoNamespace",
        "type": "string",
        "required": false,
        "description": "DynamoNamespace is deprecated and will be removed in a future version.\nThe DGD Kubernetes namespace and DynamoGraphDeployment name are used to construct the Dynamo namespace for each component"
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-envfromsecret",
        "path": "spec.envFromSecret",
        "type": "string",
        "required": false,
        "description": "EnvFromSecret references a Secret whose key/value pairs will be exposed as\nenvironment variables in the component containers."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-envs",
        "path": "spec.envs",
        "type": "array<object>",
        "required": false,
        "description": "Envs defines additional environment variables to inject into the component containers."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-eppconfig",
        "path": "spec.eppConfig",
        "type": "object",
        "required": false,
        "description": "EPPConfig defines EPP-specific configuration options for Endpoint Picker Plugin components.\nOnly applicable when ComponentType is \"epp\"."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-extrapodmetadata",
        "path": "spec.extraPodMetadata",
        "type": "object",
        "required": false,
        "description": "ExtraPodMetadata adds labels/annotations to the created Pods."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-extrapodspec",
        "path": "spec.extraPodSpec",
        "type": "object",
        "required": false,
        "description": "ExtraPodSpec allows to override the main pod spec configuration.\nIt is a k8s standard PodSpec. It also contains a MainContainer (standard k8s Container) field\nthat allows overriding the main container configuration."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-failover",
        "path": "spec.failover",
        "type": "object",
        "required": false,
        "description": "Failover configures GMS (GPU Memory Service) failover for this service.\nFor intraPod mode: the main container is cloned into two engine containers (active + standby).\nFor interPod mode: the operator creates a dedicated GMS weight server pod and\nmultiple engine pods per rank that share GPUs via DRA resource claims.",
        "metadata": [
          "requiredFields: enabled"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-frontendsidecar",
        "path": "spec.frontendSidecar",
        "type": "object",
        "required": false,
        "description": "FrontendSidecar configures an auto-generated frontend sidecar container.\nWhen specified, the operator injects a fully configured frontend container\nwith all standard Dynamo environment variables, health probes, and ports.\nThis eliminates the need to manually specify these in extraPodSpec.containers. (GAIE)",
        "metadata": [
          "requiredFields: image"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-globaldynamonamespace",
        "path": "spec.globalDynamoNamespace",
        "type": "boolean",
        "required": false,
        "description": "GlobalDynamoNamespace indicates that the Component will be placed in the global Dynamo namespace"
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-gpumemoryservice",
        "path": "spec.gpuMemoryService",
        "type": "object",
        "required": false,
        "description": "GPUMemoryService configures the GPU Memory Service (GMS) sidecar.\nWhen enabled, a GMS sidecar is injected and GPU access is managed via DRA.",
        "metadata": [
          "requiredFields: enabled",
          "x-kubernetes-validations[0].rule: !has(self.extraClientContainers) || size(self.extraClientContainers) == 0 || self.mode == 'intraPod'",
          "x-kubernetes-validations[0].message: extraClientContainers is only supported with mode=intraPod",
          "x-kubernetes-validations[1].rule: !has(self.extraClientPods) || size(self.extraClientPods) == 0 || self.mode == 'interPod'",
          "x-kubernetes-validations[1].message: extraClientPods is only supported with mode=interPod",
          "x-kubernetes-validations[2].rule: !has(self.extraClientPods) || size(self.extraClientPods) == 0",
          "x-kubernetes-validations[2].message: extraClientPods is reserved for inter-pod GMS and is not implemented yet"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-ingress",
        "path": "spec.ingress",
        "type": "object",
        "required": false,
        "description": "Ingress config to expose the component outside the cluster (or through a service mesh)."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-labels",
        "path": "spec.labels",
        "type": "object",
        "required": false,
        "description": "Labels to add to generated Kubernetes resources for this component."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-livenessprobe",
        "path": "spec.livenessProbe",
        "type": "object",
        "required": false,
        "description": "LivenessProbe to detect and restart unhealthy containers."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-modelref",
        "path": "spec.modelRef",
        "type": "object",
        "required": false,
        "description": "ModelRef references a model that this component serves\nWhen specified, a headless service will be created for endpoint discovery",
        "metadata": [
          "requiredFields: name"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-multinode",
        "path": "spec.multinode",
        "type": "object",
        "required": false,
        "description": "Multinode is the configuration for multinode components.",
        "metadata": [
          "requiredFields: nodeCount"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-readinessprobe",
        "path": "spec.readinessProbe",
        "type": "object",
        "required": false,
        "description": "ReadinessProbe to signal when the container is ready to receive traffic."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-replicas",
        "path": "spec.replicas",
        "type": "integer/int32",
        "required": false,
        "description": "Replicas is the desired number of Pods for this component.\nWhen scalingAdapter is enabled, this field is managed by the\nDynamoGraphDeploymentScalingAdapter and should not be modified directly.",
        "metadata": [
          "format: int32",
          "minimum: 0"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-resources",
        "path": "spec.resources",
        "type": "object",
        "required": false,
        "description": "Resources requested and limits for this component, including CPU, memory,\nGPUs/devices, and any runtime-specific resources."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-scalingadapter",
        "path": "spec.scalingAdapter",
        "type": "object",
        "required": false,
        "description": "ScalingAdapter configures whether this service uses the DynamoGraphDeploymentScalingAdapter.\nWhen enabled, replicas are managed via DGDSA and external autoscalers can scale\nthe service using the Scale subresource. When disabled, replicas can be modified directly."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-servicename",
        "path": "spec.serviceName",
        "type": "string",
        "required": false,
        "description": "The name of the component"
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-sharedmemory",
        "path": "spec.sharedMemory",
        "type": "object",
        "required": false,
        "description": "SharedMemory controls the tmpfs mounted at /dev/shm (enable/disable and size).",
        "metadata": [
          "x-kubernetes-validations[0].rule: (has(self.disabled) && self.disabled) || (has(self.size) && quantity(self.size).isGreaterThan(quantity('0')))",
          "x-kubernetes-validations[0].message: size is required when disabled is false"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-subcomponenttype",
        "path": "spec.subComponentType",
        "type": "string",
        "required": false,
        "description": "SubComponentType indicates the sub-role of this component (for example, \"prefill\")."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-topologyconstraint",
        "path": "spec.topologyConstraint",
        "type": "object",
        "required": false,
        "description": "TopologyConstraint for this service. packDomain is required.\nWhen both this and spec.topologyConstraint.packDomain are set, packDomain\nmust be narrower than or equal to the spec-level packDomain.",
        "metadata": [
          "requiredFields: packDomain"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-volumemounts",
        "path": "spec.volumeMounts",
        "type": "array<object>",
        "required": false,
        "description": "VolumeMounts references PVCs defined at the top level for volumes to be mounted by the component."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status",
        "path": "status",
        "type": "object",
        "required": false,
        "description": "Status reflects the current observed state of the component deployment.",
        "metadata": [
          "requiredFields: conditions"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions",
        "path": "status.conditions",
        "type": "array<object>",
        "required": true,
        "description": "Conditions captures the latest observed state of the component (including\navailability and readiness) using standard Kubernetes condition types."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-observedgeneration",
        "path": "status.observedGeneration",
        "type": "integer/int64",
        "required": false,
        "description": "ObservedGeneration is the most recent generation observed by the controller.",
        "metadata": [
          "format: int64"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-podselector",
        "path": "status.podSelector",
        "type": "object",
        "required": false,
        "description": "PodSelector contains the labels that can be used to select Pods belonging to\nthis component deployment."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-service",
        "path": "status.service",
        "type": "object",
        "required": false,
        "description": "Service contains replica status information for this service.",
        "metadata": [
          "requiredFields: componentKind, componentName, replicas, updatedReplicas"
        ]
      }
    ],
    "truncated": true,
    "truncationDepth": 1
  }
];

export function DynamoComponentDeploymentSchema0() {
  return <KubeSchemaDoc data={kubectlDocSchemas[0]} filtering={true} />;
}

export function DynamoComponentDeploymentSchema1() {
  return <KubeSchemaDoc data={kubectlDocSchemas[1]} filtering={true} />;
}
