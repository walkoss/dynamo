"use client";

import { KubeSchemaDoc } from "../KubeSchemaDoc";

const kubectlDocSchemas = [
  {
    "apiVersion": "nvidia.com/v1alpha1",
    "group": "nvidia.com",
    "version": "v1alpha1",
    "kind": "DynamoWorkerMetadata",
    "resource": "dynamoworkermetadatas",
    "lines": [
      {
        "index": 0,
        "text": "apiVersion: nvidia.com/v1alpha1",
        "description": "APIVersion defines the versioned schema of this representation",
        "depth": 0,
        "field": "apiVersion",
        "path": "apiVersion",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-apiversion"
      },
      {
        "index": 1,
        "text": "kind: DynamoWorkerMetadata",
        "description": "Kind is a string value representing the REST resource",
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
        "index": 3,
        "text": "  # Name must be unique within a namespace.",
        "description": "Name must be unique within a namespace.",
        "depth": 1,
        "path": "metadata.name",
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-name"
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
        "index": 5,
        "text": "",
        "depth": 0,
        "detailId": "line-5"
      },
      {
        "index": 6,
        "text": "  # Namespace defines the space within which each name must be unique.",
        "description": "Namespace defines the space within which each name must be unique.",
        "depth": 1,
        "path": "metadata.namespace",
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-namespace"
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
        "index": 8,
        "text": "",
        "depth": 0,
        "detailId": "line-8"
      },
      {
        "index": 9,
        "text": "  # Annotations is an unstructured key value map stored with a resource.",
        "description": "Annotations is an unstructured key value map stored with a resource.",
        "depth": 1,
        "path": "metadata.annotations",
        "detailId": "field-nvidia-com-v1alpha1-metadata-annotations"
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
        "index": 12,
        "text": "",
        "depth": 0,
        "detailId": "line-12"
      },
      {
        "index": 13,
        "text": "  # CreationTimestamp is set by the server when a resource is created.",
        "description": "CreationTimestamp is set by the server when a resource is created.",
        "depth": 1,
        "path": "metadata.creationTimestamp",
        "detailId": "field-nvidia-com-v1alpha1-metadata-creationtimestamp"
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
        "index": 15,
        "text": "",
        "depth": 0,
        "detailId": "line-15"
      },
      {
        "index": 16,
        "text": "  # Number of seconds allowed for graceful deletion.",
        "description": "Number of seconds allowed for graceful deletion.",
        "depth": 1,
        "path": "metadata.deletionGracePeriodSeconds",
        "detailId": "field-nvidia-com-v1alpha1-metadata-deletiongraceperiodseconds"
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
        "index": 18,
        "text": "",
        "depth": 0,
        "detailId": "line-18"
      },
      {
        "index": 19,
        "text": "  # DeletionTimestamp is set by the server when graceful deletion is requested.",
        "description": "DeletionTimestamp is set by the server when graceful deletion is requested.",
        "depth": 1,
        "path": "metadata.deletionTimestamp",
        "detailId": "field-nvidia-com-v1alpha1-metadata-deletiontimestamp"
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
        "index": 21,
        "text": "",
        "depth": 0,
        "detailId": "line-21"
      },
      {
        "index": 22,
        "text": "  # Finalizers must be empty before the object is deleted from the registry.",
        "description": "Finalizers must be empty before the object is deleted from the registry.",
        "depth": 1,
        "path": "metadata.finalizers",
        "detailId": "field-nvidia-com-v1alpha1-metadata-finalizers"
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
        "index": 25,
        "text": "",
        "depth": 0,
        "detailId": "line-25"
      },
      {
        "index": 26,
        "text": "  # GenerateName is an optional prefix used by the server to generate a unique",
        "description": "GenerateName is an optional prefix used by the server to generate a unique",
        "depth": 1,
        "path": "metadata.generateName",
        "detailId": "field-nvidia-com-v1alpha1-metadata-generatename"
      },
      {
        "index": 27,
        "text": "  # name.",
        "description": "name.",
        "depth": 1,
        "path": "metadata.generateName",
        "detailId": "field-nvidia-com-v1alpha1-metadata-generatename"
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
        "index": 29,
        "text": "",
        "depth": 0,
        "detailId": "line-29"
      },
      {
        "index": 30,
        "text": "  # Generation is a sequence number representing a specific desired state.",
        "description": "Generation is a sequence number representing a specific desired state.",
        "depth": 1,
        "path": "metadata.generation",
        "detailId": "field-nvidia-com-v1alpha1-metadata-generation"
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
        "index": 32,
        "text": "",
        "depth": 0,
        "detailId": "line-32"
      },
      {
        "index": 33,
        "text": "  # Labels are key value pairs used to organize and select objects.",
        "description": "Labels are key value pairs used to organize and select objects.",
        "depth": 1,
        "path": "metadata.labels",
        "detailId": "field-nvidia-com-v1alpha1-metadata-labels"
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
        "index": 36,
        "text": "",
        "depth": 0,
        "detailId": "line-36"
      },
      {
        "index": 37,
        "text": "  # ManagedFields records which actor manages which fields.",
        "description": "ManagedFields records which actor manages which fields.",
        "depth": 1,
        "path": "metadata.managedFields",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields"
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
        "index": 39,
        "text": "    # - # APIVersion defines the version of this field set.",
        "description": "APIVersion defines the version of this field set.",
        "depth": 3,
        "path": "metadata.managedFields[].apiVersion",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-apiversion"
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
        "index": 41,
        "text": "",
        "depth": 0,
        "detailId": "line-41"
      },
      {
        "index": 42,
        "text": "      # FieldsType is the discriminator for the fields format.",
        "description": "FieldsType is the discriminator for the fields format.",
        "depth": 3,
        "path": "metadata.managedFields[].fieldsType",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-fieldstype"
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
        "index": 44,
        "text": "",
        "depth": 0,
        "detailId": "line-44"
      },
      {
        "index": 45,
        "text": "      # FieldsV1 stores a versioned field set.",
        "description": "FieldsV1 stores a versioned field set.",
        "depth": 3,
        "path": "metadata.managedFields[].fieldsV1",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-fieldsv1"
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
        "index": 47,
        "text": "",
        "depth": 0,
        "detailId": "line-47"
      },
      {
        "index": 48,
        "text": "      # Manager identifies the workflow managing these fields.",
        "description": "Manager identifies the workflow managing these fields.",
        "depth": 3,
        "path": "metadata.managedFields[].manager",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-manager"
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
        "index": 50,
        "text": "",
        "depth": 0,
        "detailId": "line-50"
      },
      {
        "index": 51,
        "text": "      # Operation is the type of operation that produced this managedFields",
        "description": "Operation is the type of operation that produced this managedFields",
        "depth": 3,
        "path": "metadata.managedFields[].operation",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-operation"
      },
      {
        "index": 52,
        "text": "      # entry.",
        "description": "entry.",
        "depth": 3,
        "path": "metadata.managedFields[].operation",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-operation"
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
        "index": 54,
        "text": "",
        "depth": 0,
        "detailId": "line-54"
      },
      {
        "index": 55,
        "text": "      # Subresource is the name of the subresource used to update the object.",
        "description": "Subresource is the name of the subresource used to update the object.",
        "depth": 3,
        "path": "metadata.managedFields[].subresource",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-subresource"
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
        "index": 57,
        "text": "",
        "depth": 0,
        "detailId": "line-57"
      },
      {
        "index": 58,
        "text": "      # Time is when this managedFields entry was added.",
        "description": "Time is when this managedFields entry was added.",
        "depth": 3,
        "path": "metadata.managedFields[].time",
        "detailId": "field-nvidia-com-v1alpha1-metadata-managedfields-time"
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
        "index": 60,
        "text": "",
        "depth": 0,
        "detailId": "line-60"
      },
      {
        "index": 61,
        "text": "  # OwnerReferences lists objects depended on by this object.",
        "description": "OwnerReferences lists objects depended on by this object.",
        "depth": 1,
        "path": "metadata.ownerReferences",
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences"
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
        "index": 63,
        "text": "    - # API version of the referent.",
        "description": "API version of the referent.",
        "depth": 3,
        "path": "metadata.ownerReferences[].apiVersion",
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-apiversion"
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
        "index": 65,
        "text": "",
        "depth": 0,
        "detailId": "line-65"
      },
      {
        "index": 66,
        "text": "      # Kind of the referent.",
        "description": "Kind of the referent.",
        "depth": 3,
        "path": "metadata.ownerReferences[].kind",
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-kind"
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
        "index": 68,
        "text": "",
        "depth": 0,
        "detailId": "line-68"
      },
      {
        "index": 69,
        "text": "      # Name of the referent.",
        "description": "Name of the referent.",
        "depth": 3,
        "path": "metadata.ownerReferences[].name",
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-name"
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
        "index": 71,
        "text": "",
        "depth": 0,
        "detailId": "line-71"
      },
      {
        "index": 72,
        "text": "      # UID of the referent.",
        "description": "UID of the referent.",
        "depth": 3,
        "path": "metadata.ownerReferences[].uid",
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-uid"
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
        "index": 74,
        "text": "",
        "depth": 0,
        "detailId": "line-74"
      },
      {
        "index": 75,
        "text": "      # BlockOwnerDeletion controls foreground deletion behavior.",
        "description": "BlockOwnerDeletion controls foreground deletion behavior.",
        "depth": 3,
        "path": "metadata.ownerReferences[].blockOwnerDeletion",
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-blockownerdeletion"
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
        "index": 77,
        "text": "",
        "depth": 0,
        "detailId": "line-77"
      },
      {
        "index": 78,
        "text": "      # Controller marks the managing controller owner reference.",
        "description": "Controller marks the managing controller owner reference.",
        "depth": 3,
        "path": "metadata.ownerReferences[].controller",
        "detailId": "field-nvidia-com-v1alpha1-metadata-ownerreferences-controller"
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
        "index": 80,
        "text": "",
        "depth": 0,
        "detailId": "line-80"
      },
      {
        "index": 81,
        "text": "  # ResourceVersion is an opaque internal version value.",
        "description": "ResourceVersion is an opaque internal version value.",
        "depth": 1,
        "path": "metadata.resourceVersion",
        "detailId": "field-nvidia-com-v1alpha1-metadata-resourceversion"
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
        "index": 83,
        "text": "",
        "depth": 0,
        "detailId": "line-83"
      },
      {
        "index": 84,
        "text": "  # SelfLink is a deprecated read-only field.",
        "description": "SelfLink is a deprecated read-only field.",
        "depth": 1,
        "path": "metadata.selfLink",
        "detailId": "field-nvidia-com-v1alpha1-metadata-selflink"
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
        "index": 86,
        "text": "",
        "depth": 0,
        "detailId": "line-86"
      },
      {
        "index": 87,
        "text": "  # UID is the unique in time and space value for this object.",
        "description": "UID is the unique in time and space value for this object.",
        "depth": 1,
        "path": "metadata.uid",
        "detailId": "field-nvidia-com-v1alpha1-metadata-uid"
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
        "index": 89,
        "text": "# Spec contains the worker metadata",
        "description": "Spec contains the worker metadata",
        "depth": 0,
        "path": "spec",
        "detailId": "field-nvidia-com-v1alpha1-spec"
      },
      {
        "index": 90,
        "text": "spec: # optional",
        "description": "Spec contains the worker metadata",
        "depth": 0,
        "field": "spec",
        "path": "spec",
        "code": true,
        "foldable": true,
        "detailId": "field-nvidia-com-v1alpha1-spec"
      },
      {
        "index": 91,
        "text": "  # Raw JSON blob containing DiscoveryMetadata",
        "description": "Raw JSON blob containing DiscoveryMetadata",
        "depth": 1,
        "path": "spec.data",
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-data"
      },
      {
        "index": 92,
        "text": "  data: {} # required, preserveUnknownFields",
        "description": "Raw JSON blob containing DiscoveryMetadata",
        "depth": 1,
        "field": "data",
        "path": "spec.data",
        "code": true,
        "required": true,
        "detailId": "field-nvidia-com-v1alpha1-spec-data"
      }
    ],
    "fields": [
      {
        "id": "field-nvidia-com-v1alpha1-apiversion",
        "path": "apiVersion",
        "type": "string",
        "required": true,
        "description": "APIVersion defines the versioned schema of this representation"
      },
      {
        "id": "field-nvidia-com-v1alpha1-kind",
        "path": "kind",
        "type": "string",
        "required": true,
        "description": "Kind is a string value representing the REST resource"
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
        "description": "Spec contains the worker metadata",
        "metadata": [
          "requiredFields: data"
        ]
      },
      {
        "id": "field-nvidia-com-v1alpha1-spec-data",
        "path": "spec.data",
        "type": "object",
        "required": true,
        "description": "Raw JSON blob containing DiscoveryMetadata",
        "metadata": [
          "x-kubernetes-preserve-unknown-fields"
        ]
      }
    ]
  }
];

export function DynamoWorkerMetadataSchema0() {
  return <KubeSchemaDoc data={kubectlDocSchemas[0]} filtering={true} />;
}
