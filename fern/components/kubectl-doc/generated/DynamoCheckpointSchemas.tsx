"use client";

import { KubeSchemaDoc } from "@/components/kubectl-doc/KubeSchemaDoc";

const kubectlDocSchemas = [
  {
    "apiVersion": "nvidia.com/v1alpha1",
    "group": "nvidia.com",
    "version": "v1alpha1",
    "kind": "DynamoCheckpoint",
    "resource": "dynamocheckpoints",
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
        "text": "kind: DynamoCheckpoint",
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
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-finalizers"
      },
      {
        "index": 24,
        "text": "    # - \"<string>\"",
        "depth": 3,
        "path": "metadata.finalizers[]",
        "code": true,
        "required": true,
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
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields"
      },
      {
        "index": 40,
        "text": "      # apiVersion: \"<string>\"",
        "description": "APIVersion defines the version of this field set.",
        "depth": 3,
        "field": "apiVersion",
        "path": "metadata.managedFields[].apiVersion",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-apiversion"
      },
      {
        "index": 43,
        "text": "      # fieldsType: \"<string>\"",
        "description": "FieldsType is the discriminator for the fields format.",
        "depth": 3,
        "field": "fieldsType",
        "path": "metadata.managedFields[].fieldsType",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-fieldstype"
      },
      {
        "index": 46,
        "text": "      # fieldsV1: {} # preserveUnknownFields",
        "description": "FieldsV1 stores a versioned field set.",
        "depth": 3,
        "field": "fieldsV1",
        "path": "metadata.managedFields[].fieldsV1",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-fieldsv1"
      },
      {
        "index": 49,
        "text": "      # manager: \"<string>\"",
        "description": "Manager identifies the workflow managing these fields.",
        "depth": 3,
        "field": "manager",
        "path": "metadata.managedFields[].manager",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-manager"
      },
      {
        "index": 53,
        "text": "      # operation: \"<string>\"",
        "description": "Operation is the type of operation that produced this managedFields entry.",
        "depth": 3,
        "field": "operation",
        "path": "metadata.managedFields[].operation",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-operation"
      },
      {
        "index": 56,
        "text": "      # subresource: \"<string>\"",
        "description": "Subresource is the name of the subresource used to update the object.",
        "depth": 3,
        "field": "subresource",
        "path": "metadata.managedFields[].subresource",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-subresource"
      },
      {
        "index": 59,
        "text": "      # time: \"<string>\"",
        "description": "Time is when this managedFields entry was added.",
        "depth": 3,
        "field": "time",
        "path": "metadata.managedFields[].time",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-time"
      },
      {
        "index": 62,
        "text": "  ownerReferences: # optional",
        "description": "OwnerReferences lists objects depended on by this object.",
        "depth": 1,
        "field": "ownerReferences",
        "path": "metadata.ownerReferences",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences"
      },
      {
        "index": 64,
        "text": "      apiVersion: \"<string>\" # required",
        "description": "API version of the referent.",
        "depth": 3,
        "field": "apiVersion",
        "path": "metadata.ownerReferences[].apiVersion",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-apiversion"
      },
      {
        "index": 67,
        "text": "      kind: \"<string>\" # required",
        "description": "Kind of the referent.",
        "depth": 3,
        "field": "kind",
        "path": "metadata.ownerReferences[].kind",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-kind"
      },
      {
        "index": 70,
        "text": "      name: \"<string>\" # required",
        "description": "Name of the referent.",
        "depth": 3,
        "field": "name",
        "path": "metadata.ownerReferences[].name",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-name"
      },
      {
        "index": 73,
        "text": "      uid: \"<string>\" # required",
        "description": "UID of the referent.",
        "depth": 3,
        "field": "uid",
        "path": "metadata.ownerReferences[].uid",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-uid"
      },
      {
        "index": 76,
        "text": "      # blockOwnerDeletion: <boolean>",
        "description": "BlockOwnerDeletion controls foreground deletion behavior.",
        "depth": 3,
        "field": "blockOwnerDeletion",
        "path": "metadata.ownerReferences[].blockOwnerDeletion",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-blockownerdeletion"
      },
      {
        "index": 79,
        "text": "      # controller: <boolean>",
        "description": "Controller marks the managing controller owner reference.",
        "depth": 3,
        "field": "controller",
        "path": "metadata.ownerReferences[].controller",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-controller"
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
        "description": "DynamoCheckpointSpec defines the desired state of DynamoCheckpoint",
        "depth": 0,
        "field": "spec",
        "path": "spec",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec"
      },
      {
        "index": 92,
        "text": "  identity: # required",
        "description": "Identity defines the inputs that determine checkpoint equivalence",
        "depth": 1,
        "field": "identity",
        "path": "spec.identity",
        "code": true,
        "required": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity"
      },
      {
        "index": 94,
        "text": "    backendFramework: \"vllm\" # required, enum: \"sglang\" | \"trtllm\"",
        "description": "BackendFramework is the runtime framework (vllm, sglang, trtllm)",
        "depth": 2,
        "field": "backendFramework",
        "path": "spec.identity.backendFramework",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-backendframework"
      },
      {
        "index": 97,
        "text": "    model: \"<string>\" # required",
        "description": "Model is the model identifier (e.g., \"meta-llama/Llama-3-70B\")",
        "depth": 2,
        "field": "model",
        "path": "spec.identity.model",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-model"
      },
      {
        "index": 100,
        "text": "    # dtype: \"<string>\"",
        "description": "Dtype is the data type (fp16, bf16, fp8, etc.)",
        "depth": 2,
        "field": "dtype",
        "path": "spec.identity.dtype",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-dtype"
      },
      {
        "index": 105,
        "text": "    # dynamoVersion: \"<string>\"",
        "description": "DynamoVersion is the Dynamo platform version (optional)\nIf not specified, version is not included in identity hash\nThis ensures checkpoint compatibility across Dynamo releases",
        "depth": 2,
        "field": "dynamoVersion",
        "path": "spec.identity.dynamoVersion",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-dynamoversion"
      },
      {
        "index": 109,
        "text": "    # extraParameters:",
        "description": "ExtraParameters are additional parameters that affect the checkpoint hash\nUse for any framework-specific or custom parameters not covered above",
        "depth": 2,
        "field": "extraParameters",
        "path": "spec.identity.extraParameters",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-extraparameters"
      },
      {
        "index": 110,
        "text": "      # <key>: \"<string>\"",
        "depth": 3,
        "field": "<key>",
        "path": "spec.identity.extraParameters.<key>",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-extraparameters-key"
      },
      {
        "index": 113,
        "text": "    # maxModelLen: <int32> # minimum: 1",
        "description": "MaxModelLen is the maximum sequence length",
        "depth": 2,
        "field": "maxModelLen",
        "path": "spec.identity.maxModelLen",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-maxmodellen"
      },
      {
        "index": 116,
        "text": "    # pipelineParallelSize: 1 # default, minimum: 1",
        "description": "PipelineParallelSize is the pipeline parallel configuration",
        "depth": 2,
        "field": "pipelineParallelSize",
        "path": "spec.identity.pipelineParallelSize",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-pipelineparallelsize"
      },
      {
        "index": 119,
        "text": "    # tensorParallelSize: 1 # default, minimum: 1",
        "description": "TensorParallelSize is the tensor parallel configuration",
        "depth": 2,
        "field": "tensorParallelSize",
        "path": "spec.identity.tensorParallelSize",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-identity-tensorparallelsize"
      },
      {
        "index": 122,
        "text": "  job: # required",
        "description": "Job defines the configuration for the checkpoint creation Job",
        "depth": 1,
        "field": "job",
        "path": "spec.job",
        "code": true,
        "required": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job"
      },
      {
        "index": 128,
        "text": "    podTemplateSpec: # required",
        "description": "PodTemplateSpec allows customizing the checkpoint Job pod\nThis should include the container that runs the workload to be checkpointed\nand any workload/runtime env, service account, GMS, or DRA wiring needed\nby that container. Auto-created checkpoints from DynamoGraphDeployment\nrender Dynamo defaults before creating the DynamoCheckpoint.",
        "depth": 2,
        "field": "podTemplateSpec",
        "path": "spec.job.podTemplateSpec",
        "code": true,
        "required": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-podtemplatespec"
      },
      {
        "index": 131,
        "text": "      # metadata:",
        "description": "Standard object's metadata.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
        "depth": 3,
        "field": "metadata",
        "path": "spec.job.podTemplateSpec.metadata",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-podtemplatespec-metadata"
      },
      {
        "index": 146,
        "text": "      spec: # optional",
        "description": "Specification of the desired behavior of the pod.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
        "depth": 3,
        "field": "spec",
        "path": "spec.job.podTemplateSpec.spec",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-podtemplatespec-spec"
      },
      {
        "index": 6104,
        "text": "    # activeDeadlineSeconds: 3600 # default, minimum: 1",
        "description": "ActiveDeadlineSeconds specifies the maximum time the Job can run",
        "depth": 2,
        "field": "activeDeadlineSeconds",
        "path": "spec.job.activeDeadlineSeconds",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-activedeadlineseconds"
      },
      {
        "index": 6107,
        "text": "    # backoffLimit: <int32> # minimum: 0",
        "description": "Deprecated: BackoffLimit is ignored. Checkpoint Jobs never retry.",
        "depth": 2,
        "field": "backoffLimit",
        "path": "spec.job.backoffLimit",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-backofflimit"
      },
      {
        "index": 6112,
        "text": "    # sharedMemory:",
        "description": "SharedMemory controls the tmpfs mounted at /dev/shm for the checkpoint Job pod.\nWhen omitted, checkpoint Jobs use the same default 8Gi tmpfs as Dynamo components.",
        "depth": 2,
        "field": "sharedMemory",
        "path": "spec.job.sharedMemory",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-sharedmemory"
      },
      {
        "index": 6117,
        "text": "      # disabled: <boolean>",
        "description": "Disabled, when true, opts out of mounting a shared-memory medium for the\ncomponent. When false (or unset), shared memory is enabled and Size is\nrequired (enforced by the validating webhook). Size is ignored when\nDisabled is true.",
        "depth": 3,
        "field": "disabled",
        "path": "spec.job.sharedMemory.disabled",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-sharedmemory-disabled"
      },
      {
        "index": 6119,
        "text": "      # size: <int-or-string> # intOrString",
        "depth": 3,
        "field": "size",
        "path": "spec.job.sharedMemory.size",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-sharedmemory-size"
      },
      {
        "index": 6122,
        "text": "    # targetContainerName: \"main\" # default, minLength: 1, maxLength: 63",
        "description": "TargetContainerName is the container in PodTemplateSpec to snapshot.",
        "depth": 2,
        "field": "targetContainerName",
        "path": "spec.job.targetContainerName",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-targetcontainername"
      },
      {
        "index": 6126,
        "text": "    # ttlSecondsAfterFinished: <int32> # minimum: 0",
        "description": "Deprecated: TTLSecondsAfterFinished is ignored. Checkpoint Jobs use a fixed\n300 second TTL.",
        "depth": 2,
        "field": "ttlSecondsAfterFinished",
        "path": "spec.job.ttlSecondsAfterFinished",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-job-ttlsecondsafterfinished"
      },
      {
        "index": 6136,
        "text": "  gpuMemoryService: # optional",
        "description": "GPUMemoryService records checkpoint-time GPU Memory Service metadata for\na prepared checkpoint Job pod. The DynamoCheckpoint controller does not\ninject GMS/DRA resources; auto-created checkpoints from\nDynamoGraphDeployment prepare the pod template before creating this object.\nManual GMS-enabled checkpoints must provide the prepared pod template; the\ncontroller fails the checkpoint if the required GMS/DRA wiring is missing.\nThis field is intentionally outside spec.identity, so it does not affect\nthe checkpoint identity hash or deduplication.",
        "depth": 1,
        "field": "gpuMemoryService",
        "path": "spec.gpuMemoryService",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-gpumemoryservice"
      },
      {
        "index": 6139,
        "text": "    enabled: <boolean> # required",
        "description": "Enabled activates GMS wiring. GPU resources on client containers are\nreplaced with a DRA ResourceClaim for shared GPU access.",
        "depth": 2,
        "field": "enabled",
        "path": "spec.gpuMemoryService.enabled",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-enabled"
      },
      {
        "index": 6142,
        "text": "    # deviceClassName: \"gpu.nvidia.com\" # default",
        "description": "DeviceClassName is the DRA DeviceClass to request GPUs from.",
        "depth": 2,
        "field": "deviceClassName",
        "path": "spec.gpuMemoryService.deviceClassName",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-deviceclassname"
      },
      {
        "index": 6151,
        "text": "    # extraClientContainers: # listType: set",
        "description": "ExtraClientContainers lists additional user-declared containers that should\nbe wired as GMS clients in pods rendered from the enclosing spec.\nDGD/DCD services apply this to service pods. Auto-created checkpoints\napply checkpoint job clients before creating the DynamoCheckpoint; manual\nDynamoCheckpoint users must provide an already-prepared pod template.\nIn each rendered pod, only matching container names are wired; absent\nnames are ignored.",
        "depth": 2,
        "field": "extraClientContainers",
        "path": "spec.gpuMemoryService.extraClientContainers",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-extraclientcontainers"
      },
      {
        "index": 6157,
        "text": "    extraClientPods: # optional, listType: map, listMapKeys: name",
        "description": "ExtraClientPods declares additional GMS client pods for inter-pod GMS. This field is\nreserved for future use and is rejected until inter-pod client orchestration is wired.",
        "depth": 2,
        "field": "extraClientPods",
        "path": "spec.gpuMemoryService.extraClientPods",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-extraclientpods"
      },
      {
        "index": 6165,
        "text": "    # mode: \"intraPod\" # default, enum: \"interPod\"",
        "description": "Mode selects the GMS deployment topology.",
        "depth": 2,
        "field": "mode",
        "path": "spec.gpuMemoryService.mode",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-mode"
      },
      {
        "index": 6168,
        "text": "status: # optional",
        "description": "DynamoCheckpointStatus defines the observed state of DynamoCheckpoint",
        "depth": 0,
        "field": "status",
        "path": "status",
        "code": true,
        "foldable": true,
        "collapsed": true,
        "detailId": "field-nvidia-com-v1alpha1-status"
      },
      {
        "index": 6170,
        "text": "  conditions: # optional",
        "description": "DEPRECATED: Conditions are deprecated. Use status.phase instead.",
        "depth": 1,
        "field": "conditions",
        "path": "status.conditions",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions"
      },
      {
        "index": 6175,
        "text": "      lastTransitionTime: \"<string>\" # required",
        "description": "lastTransitionTime is the last time the condition transitioned from one status to another.\nThis should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.",
        "depth": 3,
        "field": "lastTransitionTime",
        "path": "status.conditions[].lastTransitionTime",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions-lasttransitiontime"
      },
      {
        "index": 6179,
        "text": "      message: \"<string>\" # required, maxLength: 32768",
        "description": "message is a human readable message indicating details about the transition.\nThis may be an empty string.",
        "depth": 3,
        "field": "message",
        "path": "status.conditions[].message",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions-message"
      },
      {
        "index": 6186,
        "text": "      reason: \"<string>\" # required, minLength: 1, maxLength: 1024",
        "description": "reason contains a programmatic identifier indicating the reason for the condition's last transition.\nProducers of specific condition types may define expected values and meanings for this field,\nand whether the values are considered a guaranteed API.\nThe value should be a CamelCase string.\nThis field may not be empty.",
        "depth": 3,
        "field": "reason",
        "path": "status.conditions[].reason",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions-reason"
      },
      {
        "index": 6189,
        "text": "      status: \"True\" # required, enum: \"False\" | \"Unknown\"",
        "description": "status of the condition, one of True, False, Unknown.",
        "depth": 3,
        "field": "status",
        "path": "status.conditions[].status",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions-status"
      },
      {
        "index": 6192,
        "text": "      type: \"<string>\" # required, maxLength: 316",
        "description": "type of condition in CamelCase or in foo.example.com/CamelCase.",
        "depth": 3,
        "field": "type",
        "path": "status.conditions[].type",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions-type"
      },
      {
        "index": 6199,
        "text": "      # observedGeneration: <int64> # minimum: 0",
        "description": "observedGeneration represents the .metadata.generation that the condition was set based upon.\nFor instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date\nwith respect to the current state of the instance.",
        "depth": 3,
        "field": "observedGeneration",
        "path": "status.conditions[].observedGeneration",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-conditions-observedgeneration"
      },
      {
        "index": 6202,
        "text": "  # createdAt: \"<string>\"",
        "description": "CreatedAt is the timestamp when the checkpoint became ready",
        "depth": 1,
        "field": "createdAt",
        "path": "status.createdAt",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-createdat"
      },
      {
        "index": 6206,
        "text": "  # identityHash: \"<string>\"",
        "description": "IdentityHash is the computed hash of the checkpoint identity\nThis hash is used to identify equivalent checkpoints",
        "depth": 1,
        "field": "identityHash",
        "path": "status.identityHash",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-identityhash"
      },
      {
        "index": 6209,
        "text": "  # jobName: \"<string>\"",
        "description": "JobName is the name of the checkpoint creation Job",
        "depth": 1,
        "field": "jobName",
        "path": "status.jobName",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-jobname"
      },
      {
        "index": 6213,
        "text": "  # location: \"<string>\"",
        "description": "Deprecated: Location is ignored and no longer populated. It is retained\nonly so older objects continue to validate.",
        "depth": 1,
        "field": "location",
        "path": "status.location",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-location"
      },
      {
        "index": 6216,
        "text": "  # message: \"<string>\"",
        "description": "Message provides additional information about the current state",
        "depth": 1,
        "field": "message",
        "path": "status.message",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-message"
      },
      {
        "index": 6219,
        "text": "  # phase: \"Pending\" # enum: \"Creating\" | \"Ready\" | \"Failed\"",
        "description": "Phase represents the current phase of the checkpoint lifecycle",
        "depth": 1,
        "field": "phase",
        "path": "status.phase",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-phase"
      },
      {
        "index": 6223,
        "text": "  # storageType: \"pvc\" # enum: \"s3\" | \"oci\"",
        "description": "Deprecated: StorageType is ignored and no longer populated. It is retained\nonly so older objects continue to validate.",
        "depth": 1,
        "field": "storageType",
        "path": "status.storageType",
        "code": true,
        "detailId": "field-nvidia-com-v1alpha1-status-storagetype"
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
        "id": "field-nvidia-com-v1alpha1-metadata-managedfields-apiversion",
        "path": "metadata.managedFields[].apiVersion",
        "type": "string",
        "required": false,
        "description": "APIVersion defines the version of this field set."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-managedfields-fieldstype",
        "path": "metadata.managedFields[].fieldsType",
        "type": "string",
        "required": false,
        "description": "FieldsType is the discriminator for the fields format."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-managedfields-fieldsv1",
        "path": "metadata.managedFields[].fieldsV1",
        "type": "object",
        "required": false,
        "description": "FieldsV1 stores a versioned field set.",
        "metadata": [
          "x-kubernetes-preserve-unknown-fields"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-managedfields-manager",
        "path": "metadata.managedFields[].manager",
        "type": "string",
        "required": false,
        "description": "Manager identifies the workflow managing these fields."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-managedfields-operation",
        "path": "metadata.managedFields[].operation",
        "type": "string",
        "required": false,
        "description": "Operation is the type of operation that produced this managedFields entry."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-managedfields-subresource",
        "path": "metadata.managedFields[].subresource",
        "type": "string",
        "required": false,
        "description": "Subresource is the name of the subresource used to update the object."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-managedfields-time",
        "path": "metadata.managedFields[].time",
        "type": "string/date-time",
        "required": false,
        "description": "Time is when this managedFields entry was added.",
        "metadata": [
          "format: date-time"
        ]
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
        "id": "field-nvidia-com-v1alpha1-metadata-ownerreferences-apiversion",
        "path": "metadata.ownerReferences[].apiVersion",
        "type": "string",
        "required": true,
        "description": "API version of the referent."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-ownerreferences-blockownerdeletion",
        "path": "metadata.ownerReferences[].blockOwnerDeletion",
        "type": "boolean",
        "required": false,
        "description": "BlockOwnerDeletion controls foreground deletion behavior."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-ownerreferences-controller",
        "path": "metadata.ownerReferences[].controller",
        "type": "boolean",
        "required": false,
        "description": "Controller marks the managing controller owner reference."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-ownerreferences-kind",
        "path": "metadata.ownerReferences[].kind",
        "type": "string",
        "required": true,
        "description": "Kind of the referent."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-ownerreferences-name",
        "path": "metadata.ownerReferences[].name",
        "type": "string",
        "required": true,
        "description": "Name of the referent."
      },
      {
        "id": "field-nvidia-com-v1alpha1-metadata-ownerreferences-uid",
        "path": "metadata.ownerReferences[].uid",
        "type": "string",
        "required": true,
        "description": "UID of the referent."
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
        "description": "DynamoCheckpointSpec defines the desired state of DynamoCheckpoint",
        "metadata": [
          "requiredFields: identity, job"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-gpumemoryservice",
        "path": "spec.gpuMemoryService",
        "type": "object",
        "required": false,
        "description": "GPUMemoryService records checkpoint-time GPU Memory Service metadata for\na prepared checkpoint Job pod. The DynamoCheckpoint controller does not\ninject GMS/DRA resources; auto-created checkpoints from\nDynamoGraphDeployment prepare the pod template before creating this object.\nManual GMS-enabled checkpoints must provide the prepared pod template; the\ncontroller fails the checkpoint if the required GMS/DRA wiring is missing.\nThis field is intentionally outside spec.identity, so it does not affect\nthe checkpoint identity hash or deduplication.",
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
        "id": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-deviceclassname",
        "path": "spec.gpuMemoryService.deviceClassName",
        "type": "string",
        "required": false,
        "description": "DeviceClassName is the DRA DeviceClass to request GPUs from.",
        "metadata": [
          "default: \"gpu.nvidia.com\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-enabled",
        "path": "spec.gpuMemoryService.enabled",
        "type": "boolean",
        "required": true,
        "description": "Enabled activates GMS wiring. GPU resources on client containers are\nreplaced with a DRA ResourceClaim for shared GPU access."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-extraclientcontainers",
        "path": "spec.gpuMemoryService.extraClientContainers",
        "type": "array<string>",
        "required": false,
        "description": "ExtraClientContainers lists additional user-declared containers that should\nbe wired as GMS clients in pods rendered from the enclosing spec.\nDGD/DCD services apply this to service pods. Auto-created checkpoints\napply checkpoint job clients before creating the DynamoCheckpoint; manual\nDynamoCheckpoint users must provide an already-prepared pod template.\nIn each rendered pod, only matching container names are wired; absent\nnames are ignored.",
        "metadata": [
          "x-kubernetes-list-type: set"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-extraclientcontainers",
        "path": "spec.gpuMemoryService.extraClientContainers[]",
        "type": "string",
        "required": true,
        "metadata": [
          "minLength: 1",
          "maxLength: 63",
          "pattern: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-extraclientpods",
        "path": "spec.gpuMemoryService.extraClientPods",
        "type": "array<object>",
        "required": false,
        "description": "ExtraClientPods declares additional GMS client pods for inter-pod GMS. This field is\nreserved for future use and is rejected until inter-pod client orchestration is wired.",
        "metadata": [
          "x-kubernetes-list-type: map",
          "x-kubernetes-list-map-keys: name"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-gpumemoryservice-mode",
        "path": "spec.gpuMemoryService.mode",
        "type": "string",
        "required": false,
        "description": "Mode selects the GMS deployment topology.",
        "metadata": [
          "default: \"intraPod\"",
          "enum: \"intraPod\" | \"interPod\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity",
        "path": "spec.identity",
        "type": "object",
        "required": true,
        "description": "Identity defines the inputs that determine checkpoint equivalence",
        "metadata": [
          "requiredFields: backendFramework, model"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-backendframework",
        "path": "spec.identity.backendFramework",
        "type": "string",
        "required": true,
        "description": "BackendFramework is the runtime framework (vllm, sglang, trtllm)",
        "metadata": [
          "enum: \"vllm\" | \"sglang\" | \"trtllm\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-dtype",
        "path": "spec.identity.dtype",
        "type": "string",
        "required": false,
        "description": "Dtype is the data type (fp16, bf16, fp8, etc.)"
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-dynamoversion",
        "path": "spec.identity.dynamoVersion",
        "type": "string",
        "required": false,
        "description": "DynamoVersion is the Dynamo platform version (optional)\nIf not specified, version is not included in identity hash\nThis ensures checkpoint compatibility across Dynamo releases"
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-extraparameters",
        "path": "spec.identity.extraParameters",
        "type": "object",
        "required": false,
        "description": "ExtraParameters are additional parameters that affect the checkpoint hash\nUse for any framework-specific or custom parameters not covered above"
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-extraparameters-key",
        "path": "spec.identity.extraParameters.<key>",
        "type": "string",
        "required": false
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-maxmodellen",
        "path": "spec.identity.maxModelLen",
        "type": "integer/int32",
        "required": false,
        "description": "MaxModelLen is the maximum sequence length",
        "metadata": [
          "format: int32",
          "minimum: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-model",
        "path": "spec.identity.model",
        "type": "string",
        "required": true,
        "description": "Model is the model identifier (e.g., \"meta-llama/Llama-3-70B\")"
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-pipelineparallelsize",
        "path": "spec.identity.pipelineParallelSize",
        "type": "integer/int32",
        "required": false,
        "description": "PipelineParallelSize is the pipeline parallel configuration",
        "metadata": [
          "default: 1",
          "format: int32",
          "minimum: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-identity-tensorparallelsize",
        "path": "spec.identity.tensorParallelSize",
        "type": "integer/int32",
        "required": false,
        "description": "TensorParallelSize is the tensor parallel configuration",
        "metadata": [
          "default: 1",
          "format: int32",
          "minimum: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job",
        "path": "spec.job",
        "type": "object",
        "required": true,
        "description": "Job defines the configuration for the checkpoint creation Job",
        "metadata": [
          "requiredFields: podTemplateSpec"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-activedeadlineseconds",
        "path": "spec.job.activeDeadlineSeconds",
        "type": "integer/int64",
        "required": false,
        "description": "ActiveDeadlineSeconds specifies the maximum time the Job can run",
        "metadata": [
          "default: 3600",
          "format: int64",
          "minimum: 1"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-backofflimit",
        "path": "spec.job.backoffLimit",
        "type": "integer/int32",
        "required": false,
        "description": "Deprecated: BackoffLimit is ignored. Checkpoint Jobs never retry.",
        "metadata": [
          "format: int32",
          "minimum: 0"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-podtemplatespec",
        "path": "spec.job.podTemplateSpec",
        "type": "object",
        "required": true,
        "description": "PodTemplateSpec allows customizing the checkpoint Job pod\nThis should include the container that runs the workload to be checkpointed\nand any workload/runtime env, service account, GMS, or DRA wiring needed\nby that container. Auto-created checkpoints from DynamoGraphDeployment\nrender Dynamo defaults before creating the DynamoCheckpoint."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-podtemplatespec-metadata",
        "path": "spec.job.podTemplateSpec.metadata",
        "type": "object",
        "required": false,
        "description": "Standard object's metadata.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata"
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-podtemplatespec-spec",
        "path": "spec.job.podTemplateSpec.spec",
        "type": "object",
        "required": false,
        "description": "Specification of the desired behavior of the pod.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
        "metadata": [
          "requiredFields: containers"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-sharedmemory",
        "path": "spec.job.sharedMemory",
        "type": "object",
        "required": false,
        "description": "SharedMemory controls the tmpfs mounted at /dev/shm for the checkpoint Job pod.\nWhen omitted, checkpoint Jobs use the same default 8Gi tmpfs as Dynamo components.",
        "metadata": [
          "x-kubernetes-validations[0].rule: (has(self.disabled) && self.disabled) || (has(self.size) && quantity(self.size).isGreaterThan(quantity('0')))",
          "x-kubernetes-validations[0].message: size is required when disabled is false"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-sharedmemory-disabled",
        "path": "spec.job.sharedMemory.disabled",
        "type": "boolean",
        "required": false,
        "description": "Disabled, when true, opts out of mounting a shared-memory medium for the\ncomponent. When false (or unset), shared memory is enabled and Size is\nrequired (enforced by the validating webhook). Size is ignored when\nDisabled is true."
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-sharedmemory-size",
        "path": "spec.job.sharedMemory.size",
        "type": "int-or-string",
        "required": false,
        "metadata": [
          "pattern: ^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
          "x-kubernetes-int-or-string"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-targetcontainername",
        "path": "spec.job.targetContainerName",
        "type": "string",
        "required": false,
        "description": "TargetContainerName is the container in PodTemplateSpec to snapshot.",
        "metadata": [
          "default: \"main\"",
          "minLength: 1",
          "maxLength: 63",
          "pattern: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-job-ttlsecondsafterfinished",
        "path": "spec.job.ttlSecondsAfterFinished",
        "type": "integer/int32",
        "required": false,
        "description": "Deprecated: TTLSecondsAfterFinished is ignored. Checkpoint Jobs use a fixed\n300 second TTL.",
        "metadata": [
          "format: int32",
          "minimum: 0"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status",
        "path": "status",
        "type": "object",
        "required": false,
        "description": "DynamoCheckpointStatus defines the observed state of DynamoCheckpoint"
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions",
        "path": "status.conditions",
        "type": "array<object>",
        "required": false,
        "description": "DEPRECATED: Conditions are deprecated. Use status.phase instead."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions-lasttransitiontime",
        "path": "status.conditions[].lastTransitionTime",
        "type": "string/date-time",
        "required": true,
        "description": "lastTransitionTime is the last time the condition transitioned from one status to another.\nThis should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions-message",
        "path": "status.conditions[].message",
        "type": "string",
        "required": true,
        "description": "message is a human readable message indicating details about the transition.\nThis may be an empty string.",
        "metadata": [
          "maxLength: 32768"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions-observedgeneration",
        "path": "status.conditions[].observedGeneration",
        "type": "integer/int64",
        "required": false,
        "description": "observedGeneration represents the .metadata.generation that the condition was set based upon.\nFor instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date\nwith respect to the current state of the instance.",
        "metadata": [
          "format: int64",
          "minimum: 0"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions-reason",
        "path": "status.conditions[].reason",
        "type": "string",
        "required": true,
        "description": "reason contains a programmatic identifier indicating the reason for the condition's last transition.\nProducers of specific condition types may define expected values and meanings for this field,\nand whether the values are considered a guaranteed API.\nThe value should be a CamelCase string.\nThis field may not be empty.",
        "metadata": [
          "minLength: 1",
          "maxLength: 1024",
          "pattern: ^[A-Za-z]([A-Za-z0-9_,:]*[A-Za-z0-9_])?$"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions-status",
        "path": "status.conditions[].status",
        "type": "string",
        "required": true,
        "description": "status of the condition, one of True, False, Unknown.",
        "metadata": [
          "enum: \"True\" | \"False\" | \"Unknown\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-conditions-type",
        "path": "status.conditions[].type",
        "type": "string",
        "required": true,
        "description": "type of condition in CamelCase or in foo.example.com/CamelCase.",
        "metadata": [
          "maxLength: 316",
          "pattern: ^([a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*/)?(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])$"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-createdat",
        "path": "status.createdAt",
        "type": "string/date-time",
        "required": false,
        "description": "CreatedAt is the timestamp when the checkpoint became ready",
        "metadata": [
          "format: date-time"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-identityhash",
        "path": "status.identityHash",
        "type": "string",
        "required": false,
        "description": "IdentityHash is the computed hash of the checkpoint identity\nThis hash is used to identify equivalent checkpoints"
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-jobname",
        "path": "status.jobName",
        "type": "string",
        "required": false,
        "description": "JobName is the name of the checkpoint creation Job"
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-location",
        "path": "status.location",
        "type": "string",
        "required": false,
        "description": "Deprecated: Location is ignored and no longer populated. It is retained\nonly so older objects continue to validate."
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-message",
        "path": "status.message",
        "type": "string",
        "required": false,
        "description": "Message provides additional information about the current state"
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-phase",
        "path": "status.phase",
        "type": "string",
        "required": false,
        "description": "Phase represents the current phase of the checkpoint lifecycle",
        "metadata": [
          "enum: \"Pending\" | \"Creating\" | \"Ready\" | \"Failed\""
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-status-storagetype",
        "path": "status.storageType",
        "type": "string",
        "required": false,
        "description": "Deprecated: StorageType is ignored and no longer populated. It is retained\nonly so older objects continue to validate.",
        "metadata": [
          "enum: \"pvc\" | \"s3\" | \"oci\""
        ]
      }
    ],
    "truncated": true,
    "truncationDepth": 3
  }
];

export function DynamoCheckpointSchema0() {
  return <KubeSchemaDoc data={kubectlDocSchemas[0]} filtering={true} />;
}
