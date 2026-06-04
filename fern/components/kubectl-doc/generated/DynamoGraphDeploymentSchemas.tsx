"use client";

import { KubeSchemaDoc } from "@/components/kubectl-doc/KubeSchemaDoc";

const kubectlDocSchemas = [
  {
    "apiVersion": "nvidia.com/v1beta1",
    "group": "nvidia.com",
    "version": "v1beta1",
    "kind": "DynamoGraphDeployment",
    "resource": "dynamographdeployments",
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
        "text": "kind: DynamoGraphDeployment",
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
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-annotations"
      },
      {
        "index": 11,
        "text": "    # <key>: \"<string>\"",
        "depth": 2,
        "field": "<key>",
        "path": "metadata.annotations.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-annotations-key"
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
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-labels"
      },
      {
        "index": 35,
        "text": "    # <key>: \"<string>\"",
        "depth": 2,
        "field": "<key>",
        "path": "metadata.labels.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-metadata-labels-key"
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
        "description": "spec defines the desired state for this graph deployment.",
        "depth": 0,
        "field": "spec",
        "path": "spec",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-spec"
      },
      {
        "index": 94,
        "text": "  # annotations:",
        "description": "annotations to propagate to all child resources (PCS, DCD, Deployments,\nand pod templates). Component-level (`podTemplate`) values take precedence\non conflict.",
        "depth": 1,
        "field": "annotations",
        "path": "spec.annotations",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-spec-annotations"
      },
      {
        "index": 95,
        "text": "    # <key>: \"<string>\"",
        "depth": 2,
        "field": "<key>",
        "path": "spec.annotations.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-annotations-key"
      },
      {
        "index": 99,
        "text": "  # backendFramework: \"sglang\" # enum: \"vllm\" | \"trtllm\"",
        "description": "backendFramework specifies the backend framework (e.g. \"sglang\", \"vllm\", \"trtllm\").",
        "depth": 1,
        "field": "backendFramework",
        "path": "spec.backendFramework",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-backendframework"
      },
      {
        "index": 105,
        "text": "  components: # optional, listType: map, listMapKeys: name",
        "description": "components are the components deployed as part of this graph. Each entry\ncarries its own stable logical `name`, and names must be unique within\nthe list. Component types are generally repeatable, except `type: epp`\nwhich may appear at most once.",
        "depth": 1,
        "field": "components",
        "path": "spec.components",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-components"
      },
      {
        "index": 6484,
        "text": "  env: # optional",
        "description": "env is prepended to every component's environment. Component-specific\nenv entries with the same name take precedence and may reference values\nfrom this list.",
        "depth": 1,
        "field": "env",
        "path": "spec.env",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-env"
      },
      {
        "index": 6584,
        "text": "  experimental: # optional",
        "description": "experimental groups graph-level preview features whose API shape and\nbehavior may change in breaking ways between v1beta1 releases.",
        "depth": 1,
        "field": "experimental",
        "path": "spec.experimental",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-spec-experimental"
      },
      {
        "index": 6587,
        "text": "    kvTransferPolicy: # optional",
        "description": "kvTransferPolicy configures topology-aware routing for KV-cache\ntransfers between prefill and decode workers.",
        "depth": 2,
        "field": "kvTransferPolicy",
        "path": "spec.experimental.kvTransferPolicy",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-experimental-kvtransferpolicy"
      },
      {
        "index": 6617,
        "text": "  # labels:",
        "description": "labels to propagate to all child resources. Same precedence rules as `annotations`.",
        "depth": 1,
        "field": "labels",
        "path": "spec.labels",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-spec-labels"
      },
      {
        "index": 6618,
        "text": "    # <key>: \"<string>\"",
        "depth": 2,
        "field": "<key>",
        "path": "spec.labels.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-labels-key"
      },
      {
        "index": 6622,
        "text": "  # priorityClassName: \"<string>\"",
        "description": "priorityClassName is the name of the PriorityClass to use for Grove PodCliqueSets.\nRequires the Grove pathway.",
        "depth": 1,
        "field": "priorityClassName",
        "path": "spec.priorityClassName",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-priorityclassname"
      },
      {
        "index": 6625,
        "text": "  restart: # optional",
        "description": "restart specifies the restart policy for the graph deployment.",
        "depth": 1,
        "field": "restart",
        "path": "spec.restart",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-spec-restart"
      },
      {
        "index": 6629,
        "text": "    id: \"<string>\" # required, minLength: 1",
        "description": "id is an arbitrary string that triggers a restart when changed. Any\nmodification to this value initiates a restart of the graph deployment\naccording to the configured strategy.",
        "depth": 2,
        "field": "id",
        "path": "spec.restart.id",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1beta1-spec-restart-id"
      },
      {
        "index": 6632,
        "text": "    # strategy:",
        "description": "strategy specifies the restart strategy for the graph deployment.",
        "depth": 2,
        "field": "strategy",
        "path": "spec.restart.strategy",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-restart-strategy"
      },
      {
        "index": 6647,
        "text": "  topologyConstraint: # optional",
        "description": "topologyConstraint is the deployment-level topology constraint. When\nset, `spec.topologyConstraint.clusterTopologyName` names the ClusterTopology\nCR to use. `spec.topologyConstraint.packDomain` is optional at this\nlevel and can be omitted when only components carry constraints.\nComponents without their own `topologyConstraint` inherit from this value.",
        "depth": 1,
        "field": "topologyConstraint",
        "path": "spec.topologyConstraint",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-spec-topologyconstraint"
      },
      {
        "index": 6650,
        "text": "    clusterTopologyName: \"<string>\" # required, minLength: 1",
        "description": "clusterTopologyName is the name of the ClusterTopology resource that\ndefines the topology hierarchy for this deployment.",
        "depth": 2,
        "field": "clusterTopologyName",
        "path": "spec.topologyConstraint.clusterTopologyName",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1beta1-spec-topologyconstraint-clustertopologyname"
      },
      {
        "index": 6654,
        "text": "    # packDomain: \"<string>\"",
        "description": "packDomain is the default topology domain to pack pods within.\nOptional; omit when only components carry constraints.",
        "depth": 2,
        "field": "packDomain",
        "path": "spec.topologyConstraint.packDomain",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-spec-topologyconstraint-packdomain"
      },
      {
        "index": 6657,
        "text": "status: # optional",
        "description": "status reflects the current observed state of this graph deployment.",
        "depth": 0,
        "field": "status",
        "path": "status",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1beta1-status"
      },
      {
        "index": 6659,
        "text": "  state: \"initializing\" # default, required, enum: \"pending\" | \"successful\" |",
        "description": "state is a high-level textual status of the graph deployment lifecycle.",
        "depth": 1,
        "field": "state",
        "path": "status.state",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1beta1-status-state"
      },
      {
        "index": 6664,
        "text": "  # checkpoints:",
        "description": "checkpoints contains per-component checkpoint status, keyed by component name.",
        "depth": 1,
        "field": "checkpoints",
        "path": "status.checkpoints",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-status-checkpoints"
      },
      {
        "index": 6667,
        "text": "    # <key>:",
        "description": "ComponentCheckpointStatus contains checkpoint information for a single component.",
        "depth": 2,
        "field": "<key>",
        "path": "status.checkpoints.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-checkpoints-key"
      },
      {
        "index": 6679,
        "text": "  components: # optional",
        "description": "components contains per-component replica status information, keyed by component name.",
        "depth": 1,
        "field": "components",
        "path": "status.components",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-status-components"
      },
      {
        "index": 6682,
        "text": "    <key>: # optional",
        "description": "ComponentReplicaStatus contains replica information for a single component.",
        "depth": 2,
        "field": "<key>",
        "path": "status.components.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-components-key"
      },
      {
        "index": 6714,
        "text": "  conditions: # optional, listType: map, listMapKeys: type",
        "description": "conditions contains the latest observed conditions of the graph deployment.\nMerged by type on patch updates.",
        "depth": 1,
        "field": "conditions",
        "path": "status.conditions",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-conditions"
      },
      {
        "index": 6746,
        "text": "  # observedGeneration: <int64>",
        "description": "observedGeneration is the most recent generation observed by the controller.",
        "depth": 1,
        "field": "observedGeneration",
        "path": "status.observedGeneration",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-observedgeneration"
      },
      {
        "index": 6749,
        "text": "  # restart:",
        "description": "restart contains the status of a graph-level restart.",
        "depth": 1,
        "field": "restart",
        "path": "status.restart",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-status-restart"
      },
      {
        "index": 6751,
        "text": "    # inProgress:",
        "description": "inProgress contains the names of the components currently being restarted.",
        "depth": 2,
        "field": "inProgress",
        "path": "status.restart.inProgress",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-restart-inprogress"
      },
      {
        "index": 6756,
        "text": "    # observedID: \"<string>\"",
        "description": "observedID is the restart ID currently being processed. Matches `Restart.id` in the spec.",
        "depth": 2,
        "field": "observedID",
        "path": "status.restart.observedID",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-restart-observedid"
      },
      {
        "index": 6759,
        "text": "    # phase: \"<string>\"",
        "description": "phase is the phase of the restart.",
        "depth": 2,
        "field": "phase",
        "path": "status.restart.phase",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-restart-phase"
      },
      {
        "index": 6764,
        "text": "  # rollingUpdate:",
        "description": "rollingUpdate tracks the progress of operator-managed rolling updates.\nCurrently only supported for single-node, non-Grove deployments (DCD/Deployment).",
        "depth": 1,
        "field": "rollingUpdate",
        "path": "status.rollingUpdate",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1beta1-status-rollingupdate"
      },
      {
        "index": 6766,
        "text": "    # endTime: \"<string>\"",
        "description": "endTime is when the rolling update completed (successfully or failed).",
        "depth": 2,
        "field": "endTime",
        "path": "status.rollingUpdate.endTime",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-rollingupdate-endtime"
      },
      {
        "index": 6769,
        "text": "    # phase: \"Pending\" # enum: \"InProgress\" | \"Completed\" | \"Failed\" | \"\"",
        "description": "phase indicates the current phase of the rolling update.",
        "depth": 2,
        "field": "phase",
        "path": "status.rollingUpdate.phase",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-rollingupdate-phase"
      },
      {
        "index": 6772,
        "text": "    # startTime: \"<string>\"",
        "description": "startTime is when the rolling update began.",
        "depth": 2,
        "field": "startTime",
        "path": "status.rollingUpdate.startTime",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-rollingupdate-starttime"
      },
      {
        "index": 6776,
        "text": "    # updatedComponents:",
        "description": "updatedComponents is the list of components that have completed the\nrolling update.",
        "depth": 2,
        "field": "updatedComponents",
        "path": "status.rollingUpdate.updatedComponents",
        "code": true,
        "detailId": "field-nvidia-com-v1beta1-status-rollingupdate-updatedcomponents"
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
        "id": "field-nvidia-com-v1beta1-metadata-annotations-key",
        "path": "metadata.annotations.<key>",
        "type": "string",
        "required": false
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
        "id": "field-nvidia-com-v1beta1-metadata-finalizers",
        "path": "metadata.finalizers[]",
        "type": "string",
        "required": true
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
        "id": "field-nvidia-com-v1beta1-metadata-labels-key",
        "path": "metadata.labels.<key>",
        "type": "string",
        "required": false
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
        "description": "spec defines the desired state for this graph deployment."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-annotations",
        "path": "spec.annotations",
        "type": "object",
        "required": false,
        "description": "annotations to propagate to all child resources (PCS, DCD, Deployments,\nand pod templates). Component-level (`podTemplate`) values take precedence\non conflict."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-annotations-key",
        "path": "spec.annotations.<key>",
        "type": "string",
        "required": false
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-backendframework",
        "path": "spec.backendFramework",
        "type": "string",
        "required": false,
        "description": "backendFramework specifies the backend framework (e.g. \"sglang\", \"vllm\", \"trtllm\").",
        "metadata": [
          "enum: \"sglang\" | \"vllm\" | \"trtllm\""
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-components",
        "path": "spec.components",
        "type": "array<object>",
        "required": false,
        "description": "components are the components deployed as part of this graph. Each entry\ncarries its own stable logical `name`, and names must be unique within\nthe list. Component types are generally repeatable, except `type: epp`\nwhich may appear at most once.",
        "metadata": [
          "maxItems: 25",
          "x-kubernetes-list-type: map",
          "x-kubernetes-list-map-keys: name",
          "x-kubernetes-validations[0].rule: self.filter(c, has(c.type) && c.type == 'epp').size() <= 1",
          "x-kubernetes-validations[0].message: at most one component may have type epp",
          "x-kubernetes-validations[1].rule: self.all(c1, !has(c1.name) || self.filter(c2, has(c2.name) && c2.name.lowerAscii() == c1.name.lowerAscii()).size() == 1)",
          "x-kubernetes-validations[1].message: component names must be unique case-insensitively"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-env",
        "path": "spec.env",
        "type": "array<object>",
        "required": false,
        "description": "env is prepended to every component's environment. Component-specific\nenv entries with the same name take precedence and may reference values\nfrom this list."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-experimental",
        "path": "spec.experimental",
        "type": "object",
        "required": false,
        "description": "experimental groups graph-level preview features whose API shape and\nbehavior may change in breaking ways between v1beta1 releases."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-experimental-kvtransferpolicy",
        "path": "spec.experimental.kvTransferPolicy",
        "type": "object",
        "required": false,
        "description": "kvTransferPolicy configures topology-aware routing for KV-cache\ntransfers between prefill and decode workers.",
        "metadata": [
          "requiredFields: domain",
          "x-kubernetes-validations[0].rule: has(self.labelKey)",
          "x-kubernetes-validations[0].message: labelKey is required until alternate topology sources are supported",
          "x-kubernetes-validations[1].rule: !has(self.enforcement) || self.enforcement != 'preferred' || has(self.preferredWeight)",
          "x-kubernetes-validations[1].message: preferredWeight is required when enforcement is preferred",
          "x-kubernetes-validations[2].rule: !has(self.preferredWeight) || (has(self.enforcement) && self.enforcement == 'preferred')",
          "x-kubernetes-validations[2].message: preferredWeight may only be set when enforcement is preferred"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-labels",
        "path": "spec.labels",
        "type": "object",
        "required": false,
        "description": "labels to propagate to all child resources. Same precedence rules as `annotations`."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-labels-key",
        "path": "spec.labels.<key>",
        "type": "string",
        "required": false
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-priorityclassname",
        "path": "spec.priorityClassName",
        "type": "string",
        "required": false,
        "description": "priorityClassName is the name of the PriorityClass to use for Grove PodCliqueSets.\nRequires the Grove pathway."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-restart",
        "path": "spec.restart",
        "type": "object",
        "required": false,
        "description": "restart specifies the restart policy for the graph deployment.",
        "metadata": [
          "requiredFields: id"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-restart-id",
        "path": "spec.restart.id",
        "type": "string",
        "required": true,
        "description": "id is an arbitrary string that triggers a restart when changed. Any\nmodification to this value initiates a restart of the graph deployment\naccording to the configured strategy.",
        "metadata": [
          "minLength: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-restart-strategy",
        "path": "spec.restart.strategy",
        "type": "object",
        "required": false,
        "description": "strategy specifies the restart strategy for the graph deployment."
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-topologyconstraint",
        "path": "spec.topologyConstraint",
        "type": "object",
        "required": false,
        "description": "topologyConstraint is the deployment-level topology constraint. When\nset, `spec.topologyConstraint.clusterTopologyName` names the ClusterTopology\nCR to use. `spec.topologyConstraint.packDomain` is optional at this\nlevel and can be omitted when only components carry constraints.\nComponents without their own `topologyConstraint` inherit from this value.",
        "metadata": [
          "requiredFields: clusterTopologyName"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-topologyconstraint-clustertopologyname",
        "path": "spec.topologyConstraint.clusterTopologyName",
        "type": "string",
        "required": true,
        "description": "clusterTopologyName is the name of the ClusterTopology resource that\ndefines the topology hierarchy for this deployment.",
        "metadata": [
          "minLength: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-spec-topologyconstraint-packdomain",
        "path": "spec.topologyConstraint.packDomain",
        "type": "string",
        "required": false,
        "description": "packDomain is the default topology domain to pack pods within.\nOptional; omit when only components carry constraints.",
        "metadata": [
          "pattern: ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status",
        "path": "status",
        "type": "object",
        "required": false,
        "description": "status reflects the current observed state of this graph deployment.",
        "metadata": [
          "requiredFields: state"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-checkpoints",
        "path": "status.checkpoints",
        "type": "object",
        "required": false,
        "description": "checkpoints contains per-component checkpoint status, keyed by component name."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-checkpoints-key",
        "path": "status.checkpoints.<key>",
        "type": "object",
        "required": false,
        "description": "ComponentCheckpointStatus contains checkpoint information for a single component."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-components",
        "path": "status.components",
        "type": "object",
        "required": false,
        "description": "components contains per-component replica status information, keyed by component name."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-components-key",
        "path": "status.components.<key>",
        "type": "object",
        "required": false,
        "description": "ComponentReplicaStatus contains replica information for a single component.",
        "metadata": [
          "requiredFields: componentKind, replicas, updatedReplicas"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-conditions",
        "path": "status.conditions",
        "type": "array<object>",
        "required": false,
        "description": "conditions contains the latest observed conditions of the graph deployment.\nMerged by type on patch updates.",
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
      },
      {
        "id": "field-nvidia-com-v1beta1-status-restart",
        "path": "status.restart",
        "type": "object",
        "required": false,
        "description": "restart contains the status of a graph-level restart."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-restart-inprogress",
        "path": "status.restart.inProgress",
        "type": "array<string>",
        "required": false,
        "description": "inProgress contains the names of the components currently being restarted."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-restart-observedid",
        "path": "status.restart.observedID",
        "type": "string",
        "required": false,
        "description": "observedID is the restart ID currently being processed. Matches `Restart.id` in the spec."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-restart-phase",
        "path": "status.restart.phase",
        "type": "string",
        "required": false,
        "description": "phase is the phase of the restart."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-rollingupdate",
        "path": "status.rollingUpdate",
        "type": "object",
        "required": false,
        "description": "rollingUpdate tracks the progress of operator-managed rolling updates.\nCurrently only supported for single-node, non-Grove deployments (DCD/Deployment)."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-rollingupdate-endtime",
        "path": "status.rollingUpdate.endTime",
        "type": "string/date-time",
        "required": false,
        "description": "endTime is when the rolling update completed (successfully or failed).",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-rollingupdate-phase",
        "path": "status.rollingUpdate.phase",
        "type": "string",
        "required": false,
        "description": "phase indicates the current phase of the rolling update.",
        "metadata": [
          "enum: \"Pending\" | \"InProgress\" | \"Completed\" | \"Failed\" | \"\""
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-rollingupdate-starttime",
        "path": "status.rollingUpdate.startTime",
        "type": "string/date-time",
        "required": false,
        "description": "startTime is when the rolling update began.",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1beta1-status-rollingupdate-updatedcomponents",
        "path": "status.rollingUpdate.updatedComponents",
        "type": "array<string>",
        "required": false,
        "description": "updatedComponents is the list of components that have completed the\nrolling update."
      },
      {
        "id": "field-nvidia-com-v1beta1-status-state",
        "path": "status.state",
        "type": "string",
        "required": true,
        "description": "state is a high-level textual status of the graph deployment lifecycle.",
        "metadata": [
          "default: \"initializing\"",
          "enum: \"initializing\" | \"pending\" | \"successful\" | \"failed\""
        ]
      }
    ],
    "truncated": true,
    "truncationDepth": 2
  },
  {
    "apiVersion": "nvidia.com/v1alpha1",
    "group": "nvidia.com",
    "version": "v1alpha1",
    "kind": "DynamoGraphDeployment",
    "resource": "dynamographdeployments",
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
        "text": "kind: DynamoGraphDeployment",
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
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-annotations"
      },
      {
        "index": 11,
        "text": "    # <key>: \"<string>\"",
        "depth": 2,
        "field": "<key>",
        "path": "metadata.annotations.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-annotations-key"
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
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-labels"
      },
      {
        "index": 35,
        "text": "    # <key>: \"<string>\"",
        "depth": 2,
        "field": "<key>",
        "path": "metadata.labels.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-labels-key"
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
        "description": "Spec defines the desired state for this graph deployment.",
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
        "description": "Annotations to propagate to all child resources (PCS, DCD, Deployments, and pod templates).\nService-level annotations take precedence over these values.",
        "depth": 1,
        "field": "annotations",
        "path": "spec.annotations",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-annotations"
      },
      {
        "index": 94,
        "text": "    # <key>: \"<string>\"",
        "depth": 2,
        "field": "<key>",
        "path": "spec.annotations.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-annotations-key"
      },
      {
        "index": 98,
        "text": "  # backendFramework: \"sglang\" # enum: \"vllm\" | \"trtllm\"",
        "description": "BackendFramework specifies the backend framework (e.g., \"sglang\", \"vllm\", \"trtllm\").",
        "depth": 1,
        "field": "backendFramework",
        "path": "spec.backendFramework",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-backendframework"
      },
      {
        "index": 102,
        "text": "  envs: # optional",
        "description": "Envs are environment variables applied to all services in the deployment unless\noverridden by service-specific configuration.",
        "depth": 1,
        "field": "envs",
        "path": "spec.envs",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-envs"
      },
      {
        "index": 202,
        "text": "  experimental: # optional",
        "description": "Experimental groups graph-level preview features whose API shape and\nbehavior may change in breaking ways between releases.",
        "depth": 1,
        "field": "experimental",
        "path": "spec.experimental",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-experimental"
      },
      {
        "index": 205,
        "text": "    kvTransferPolicy: # optional",
        "description": "KvTransferPolicy configures topology-aware routing for KV-cache\ntransfers between prefill and decode workers.",
        "depth": 2,
        "field": "kvTransferPolicy",
        "path": "spec.experimental.kvTransferPolicy",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-experimental-kvtransferpolicy"
      },
      {
        "index": 235,
        "text": "  # labels:",
        "description": "Labels to propagate to all child resources (PCS, DCD, Deployments, and pod templates).\nService-level labels take precedence over these values.",
        "depth": 1,
        "field": "labels",
        "path": "spec.labels",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-labels"
      },
      {
        "index": 236,
        "text": "    # <key>: \"<string>\"",
        "depth": 2,
        "field": "<key>",
        "path": "spec.labels.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-labels-key"
      },
      {
        "index": 240,
        "text": "  # priorityClassName: \"<string>\"",
        "description": "PriorityClassName is the name of the PriorityClass to use for Grove PodCliqueSets.\nRequires the Grove pathway.",
        "depth": 1,
        "field": "priorityClassName",
        "path": "spec.priorityClassName",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-priorityclassname"
      },
      {
        "index": 245,
        "text": "  pvcs: # optional",
        "description": "PVCs defines a list of persistent volume claims that can be referenced by components.\nEach PVC must have a unique name that can be referenced in component specifications.",
        "depth": 1,
        "field": "pvcs",
        "path": "spec.pvcs",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-pvcs"
      },
      {
        "index": 264,
        "text": "  restart: # optional",
        "description": "Restart specifies the restart policy for the graph deployment.",
        "depth": 1,
        "field": "restart",
        "path": "spec.restart",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-restart"
      },
      {
        "index": 268,
        "text": "    id: \"<string>\" # required, minLength: 1",
        "description": "ID is an arbitrary string that triggers a restart when changed.\nAny modification to this value will initiate a restart of the graph deployment according to the strategy.",
        "depth": 2,
        "field": "id",
        "path": "spec.restart.id",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-restart-id"
      },
      {
        "index": 271,
        "text": "    # strategy:",
        "description": "Strategy specifies the restart strategy for the graph deployment.",
        "depth": 2,
        "field": "strategy",
        "path": "spec.restart.strategy",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-restart-strategy"
      },
      {
        "index": 280,
        "text": "  services: # optional",
        "description": "Services are the services to deploy as part of this deployment.",
        "depth": 1,
        "field": "services",
        "path": "spec.services",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-services"
      },
      {
        "index": 281,
        "text": "    <key>: # optional",
        "depth": 2,
        "field": "<key>",
        "path": "spec.services.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-services-key"
      },
      {
        "index": 8518,
        "text": "  topologyConstraint: # optional",
        "description": "TopologyConstraint is the deployment-level topology constraint.\nWhen set, topologyProfile is required and names the ClusterTopology CR to use.\npackDomain is optional here \u2014 it can be omitted when only services carry constraints.\nServices without their own topologyConstraint inherit from this value.",
        "depth": 1,
        "field": "topologyConstraint",
        "path": "spec.topologyConstraint",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-topologyconstraint"
      },
      {
        "index": 8521,
        "text": "    topologyProfile: \"<string>\" # required, minLength: 1",
        "description": "TopologyProfile is the name of the ClusterTopology CR that defines the\ntopology hierarchy for this deployment.",
        "depth": 2,
        "field": "topologyProfile",
        "path": "spec.topologyConstraint.topologyProfile",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-topologyconstraint-topologyprofile"
      },
      {
        "index": 8525,
        "text": "    # packDomain: \"<string>\"",
        "description": "PackDomain is the default topology domain to pack pods within.\nOptional \u2014 omit when only services carry constraints.",
        "depth": 2,
        "field": "packDomain",
        "path": "spec.topologyConstraint.packDomain",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-topologyconstraint-packdomain"
      },
      {
        "index": 8528,
        "text": "status: # optional",
        "description": "Status reflects the current observed state of this graph deployment.",
        "depth": 0,
        "field": "status",
        "path": "status",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-status"
      },
      {
        "index": 8530,
        "text": "  state: \"initializing\" # default, required, enum: \"pending\" | \"successful\" |",
        "description": "State is a high-level textual status of the graph deployment lifecycle.",
        "depth": 1,
        "field": "state",
        "path": "status.state",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-status-state"
      },
      {
        "index": 8535,
        "text": "  # checkpoints:",
        "description": "Checkpoints contains per-service checkpoint status information.\nThe map key is the service name from spec.services.",
        "depth": 1,
        "field": "checkpoints",
        "path": "status.checkpoints",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-status-checkpoints"
      },
      {
        "index": 8538,
        "text": "    # <key>:",
        "description": "ServiceCheckpointStatus contains checkpoint information for a single service.",
        "depth": 2,
        "field": "<key>",
        "path": "status.checkpoints.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-checkpoints-key"
      },
      {
        "index": 8550,
        "text": "  conditions: # optional",
        "description": "Conditions contains the latest observed conditions of the graph deployment.\nThe slice is merged by type on patch updates.",
        "depth": 1,
        "field": "conditions",
        "path": "status.conditions",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions"
      },
      {
        "index": 8582,
        "text": "  # observedGeneration: <int64>",
        "description": "ObservedGeneration is the most recent generation observed by the controller.",
        "depth": 1,
        "field": "observedGeneration",
        "path": "status.observedGeneration",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-observedgeneration"
      },
      {
        "index": 8585,
        "text": "  # restart:",
        "description": "Restart contains the status of the restart of the graph deployment.",
        "depth": 1,
        "field": "restart",
        "path": "status.restart",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-status-restart"
      },
      {
        "index": 8588,
        "text": "    # inProgress:",
        "description": "InProgress contains the names of the services that are currently being restarted.",
        "depth": 2,
        "field": "inProgress",
        "path": "status.restart.inProgress",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-restart-inprogress"
      },
      {
        "index": 8593,
        "text": "    # observedID: \"<string>\"",
        "description": "ObservedID is the restart ID that has been observed and is being processed.\nMatches the Restart.ID field in the spec.",
        "depth": 2,
        "field": "observedID",
        "path": "status.restart.observedID",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-restart-observedid"
      },
      {
        "index": 8596,
        "text": "    # phase: \"<string>\"",
        "description": "Phase is the phase of the restart.",
        "depth": 2,
        "field": "phase",
        "path": "status.restart.phase",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-restart-phase"
      },
      {
        "index": 8601,
        "text": "  # rollingUpdate:",
        "description": "RollingUpdate tracks the progress of operator manged rolling updates.\nCurrently only supported for singl-node, non-Grove deployments (DCD/Deployment).",
        "depth": 1,
        "field": "rollingUpdate",
        "path": "status.rollingUpdate",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-status-rollingupdate"
      },
      {
        "index": 8603,
        "text": "    # endTime: \"<string>\"",
        "description": "EndTime is when the rolling update completed (successfully or failed).",
        "depth": 2,
        "field": "endTime",
        "path": "status.rollingUpdate.endTime",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-rollingupdate-endtime"
      },
      {
        "index": 8606,
        "text": "    # phase: \"Pending\" # enum: \"InProgress\" | \"Completed\" | \"Failed\" | \"\"",
        "description": "Phase indicates the current phase of the rolling update.",
        "depth": 2,
        "field": "phase",
        "path": "status.rollingUpdate.phase",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-rollingupdate-phase"
      },
      {
        "index": 8609,
        "text": "    # startTime: \"<string>\"",
        "description": "StartTime is when the rolling update began.",
        "depth": 2,
        "field": "startTime",
        "path": "status.rollingUpdate.startTime",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-rollingupdate-starttime"
      },
      {
        "index": 8615,
        "text": "    # updatedServices:",
        "description": "UpdatedServices is the list of services that have completed the rolling update.\nA service is considered updated when its new replicas are all ready and old replicas are fully scaled down.\nOnly services of componentType Worker (or Prefill/Decode) are considered.",
        "depth": 2,
        "field": "updatedServices",
        "path": "status.rollingUpdate.updatedServices",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-rollingupdate-updatedservices"
      },
      {
        "index": 8620,
        "text": "  services: # optional",
        "description": "Services contains per-service replica status information.\nThe map key is the service name from spec.services.",
        "depth": 1,
        "field": "services",
        "path": "status.services",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-status-services"
      },
      {
        "index": 8622,
        "text": "    <key>: # optional",
        "description": "ServiceReplicaStatus contains replica information for a single service.",
        "depth": 2,
        "field": "<key>",
        "path": "status.services.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-services-key"
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
        "id": "field-nvidia-com-v1alpha1-metadata-annotations-key",
        "path": "metadata.annotations.<key>",
        "type": "string",
        "required": false
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
        "id": "field-nvidia-com-v1alpha1-metadata-finalizers",
        "path": "metadata.finalizers[]",
        "type": "string",
        "required": true
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
        "id": "field-nvidia-com-v1alpha1-metadata-labels-key",
        "path": "metadata.labels.<key>",
        "type": "string",
        "required": false
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
        "description": "Spec defines the desired state for this graph deployment."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-annotations",
        "path": "spec.annotations",
        "type": "object",
        "required": false,
        "description": "Annotations to propagate to all child resources (PCS, DCD, Deployments, and pod templates).\nService-level annotations take precedence over these values."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-annotations-key",
        "path": "spec.annotations.<key>",
        "type": "string",
        "required": false
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-backendframework",
        "path": "spec.backendFramework",
        "type": "string",
        "required": false,
        "description": "BackendFramework specifies the backend framework (e.g., \"sglang\", \"vllm\", \"trtllm\").",
        "metadata": [
          "enum: \"sglang\" | \"vllm\" | \"trtllm\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-envs",
        "path": "spec.envs",
        "type": "array<object>",
        "required": false,
        "description": "Envs are environment variables applied to all services in the deployment unless\noverridden by service-specific configuration."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-experimental",
        "path": "spec.experimental",
        "type": "object",
        "required": false,
        "description": "Experimental groups graph-level preview features whose API shape and\nbehavior may change in breaking ways between releases."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-experimental-kvtransferpolicy",
        "path": "spec.experimental.kvTransferPolicy",
        "type": "object",
        "required": false,
        "description": "KvTransferPolicy configures topology-aware routing for KV-cache\ntransfers between prefill and decode workers.",
        "metadata": [
          "requiredFields: domain",
          "x-kubernetes-validations[0].rule: has(self.labelKey)",
          "x-kubernetes-validations[0].message: labelKey is required until alternate topology sources are supported",
          "x-kubernetes-validations[1].rule: !has(self.enforcement) || self.enforcement != 'preferred' || has(self.preferredWeight)",
          "x-kubernetes-validations[1].message: preferredWeight is required when enforcement is preferred",
          "x-kubernetes-validations[2].rule: !has(self.preferredWeight) || (has(self.enforcement) && self.enforcement == 'preferred')",
          "x-kubernetes-validations[2].message: preferredWeight may only be set when enforcement is preferred"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-labels",
        "path": "spec.labels",
        "type": "object",
        "required": false,
        "description": "Labels to propagate to all child resources (PCS, DCD, Deployments, and pod templates).\nService-level labels take precedence over these values."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-labels-key",
        "path": "spec.labels.<key>",
        "type": "string",
        "required": false
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-priorityclassname",
        "path": "spec.priorityClassName",
        "type": "string",
        "required": false,
        "description": "PriorityClassName is the name of the PriorityClass to use for Grove PodCliqueSets.\nRequires the Grove pathway."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-pvcs",
        "path": "spec.pvcs",
        "type": "array<object>",
        "required": false,
        "description": "PVCs defines a list of persistent volume claims that can be referenced by components.\nEach PVC must have a unique name that can be referenced in component specifications.",
        "metadata": [
          "maxItems: 100"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-restart",
        "path": "spec.restart",
        "type": "object",
        "required": false,
        "description": "Restart specifies the restart policy for the graph deployment.",
        "metadata": [
          "requiredFields: id"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-restart-id",
        "path": "spec.restart.id",
        "type": "string",
        "required": true,
        "description": "ID is an arbitrary string that triggers a restart when changed.\nAny modification to this value will initiate a restart of the graph deployment according to the strategy.",
        "metadata": [
          "minLength: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-restart-strategy",
        "path": "spec.restart.strategy",
        "type": "object",
        "required": false,
        "description": "Strategy specifies the restart strategy for the graph deployment."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-services",
        "path": "spec.services",
        "type": "object",
        "required": false,
        "description": "Services are the services to deploy as part of this deployment.",
        "metadata": [
          "maxProperties: 25"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-services-key",
        "path": "spec.services.<key>",
        "type": "object",
        "required": false
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-topologyconstraint",
        "path": "spec.topologyConstraint",
        "type": "object",
        "required": false,
        "description": "TopologyConstraint is the deployment-level topology constraint.\nWhen set, topologyProfile is required and names the ClusterTopology CR to use.\npackDomain is optional here \u2014 it can be omitted when only services carry constraints.\nServices without their own topologyConstraint inherit from this value.",
        "metadata": [
          "requiredFields: topologyProfile"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-topologyconstraint-packdomain",
        "path": "spec.topologyConstraint.packDomain",
        "type": "string",
        "required": false,
        "description": "PackDomain is the default topology domain to pack pods within.\nOptional \u2014 omit when only services carry constraints.",
        "metadata": [
          "pattern: ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-topologyconstraint-topologyprofile",
        "path": "spec.topologyConstraint.topologyProfile",
        "type": "string",
        "required": true,
        "description": "TopologyProfile is the name of the ClusterTopology CR that defines the\ntopology hierarchy for this deployment.",
        "metadata": [
          "minLength: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status",
        "path": "status",
        "type": "object",
        "required": false,
        "description": "Status reflects the current observed state of this graph deployment.",
        "metadata": [
          "requiredFields: state"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-checkpoints",
        "path": "status.checkpoints",
        "type": "object",
        "required": false,
        "description": "Checkpoints contains per-service checkpoint status information.\nThe map key is the service name from spec.services."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-checkpoints-key",
        "path": "status.checkpoints.<key>",
        "type": "object",
        "required": false,
        "description": "ServiceCheckpointStatus contains checkpoint information for a single service."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions",
        "path": "status.conditions",
        "type": "array<object>",
        "required": false,
        "description": "Conditions contains the latest observed conditions of the graph deployment.\nThe slice is merged by type on patch updates."
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
        "id": "field-nvidia-com-v1alpha1-status-restart",
        "path": "status.restart",
        "type": "object",
        "required": false,
        "description": "Restart contains the status of the restart of the graph deployment."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-restart-inprogress",
        "path": "status.restart.inProgress",
        "type": "array<string>",
        "required": false,
        "description": "InProgress contains the names of the services that are currently being restarted."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-restart-observedid",
        "path": "status.restart.observedID",
        "type": "string",
        "required": false,
        "description": "ObservedID is the restart ID that has been observed and is being processed.\nMatches the Restart.ID field in the spec."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-restart-phase",
        "path": "status.restart.phase",
        "type": "string",
        "required": false,
        "description": "Phase is the phase of the restart."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-rollingupdate",
        "path": "status.rollingUpdate",
        "type": "object",
        "required": false,
        "description": "RollingUpdate tracks the progress of operator manged rolling updates.\nCurrently only supported for singl-node, non-Grove deployments (DCD/Deployment)."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-rollingupdate-endtime",
        "path": "status.rollingUpdate.endTime",
        "type": "string/date-time",
        "required": false,
        "description": "EndTime is when the rolling update completed (successfully or failed).",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-rollingupdate-phase",
        "path": "status.rollingUpdate.phase",
        "type": "string",
        "required": false,
        "description": "Phase indicates the current phase of the rolling update.",
        "metadata": [
          "enum: \"Pending\" | \"InProgress\" | \"Completed\" | \"Failed\" | \"\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-rollingupdate-starttime",
        "path": "status.rollingUpdate.startTime",
        "type": "string/date-time",
        "required": false,
        "description": "StartTime is when the rolling update began.",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-rollingupdate-updatedservices",
        "path": "status.rollingUpdate.updatedServices",
        "type": "array<string>",
        "required": false,
        "description": "UpdatedServices is the list of services that have completed the rolling update.\nA service is considered updated when its new replicas are all ready and old replicas are fully scaled down.\nOnly services of componentType Worker (or Prefill/Decode) are considered."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-services",
        "path": "status.services",
        "type": "object",
        "required": false,
        "description": "Services contains per-service replica status information.\nThe map key is the service name from spec.services."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-services-key",
        "path": "status.services.<key>",
        "type": "object",
        "required": false,
        "description": "ServiceReplicaStatus contains replica information for a single service.",
        "metadata": [
          "requiredFields: componentKind, componentName, replicas, updatedReplicas"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-state",
        "path": "status.state",
        "type": "string",
        "required": true,
        "description": "State is a high-level textual status of the graph deployment lifecycle.",
        "metadata": [
          "default: \"initializing\"",
          "enum: \"initializing\" | \"pending\" | \"successful\" | \"failed\""
        ]
      }
    ],
    "truncated": true,
    "truncationDepth": 2
  }
];

export function DynamoGraphDeploymentSchema0() {
  return <KubeSchemaDoc data={kubectlDocSchemas[0]} filtering={true} />;
}

export function DynamoGraphDeploymentSchema1() {
  return <KubeSchemaDoc data={kubectlDocSchemas[1]} filtering={true} />;
}
