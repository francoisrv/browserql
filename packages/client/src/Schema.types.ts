import { Schema } from ".";
import { ObjectTypeDefinitionNode, DocumentNode, ObjectTypeExtensionNode, DefinitionNode } from "graphql";
import { find } from "lodash";
import gql from 'graphql-tag'
import SchemaDirectives from "./Schema.directives";

export default class SchemaTypes {
  static isType(type: DefinitionNode) {
    return type.kind === 'ObjectTypeDefinition'
  }

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  getTypes(): ObjectTypeDefinitionNode[] {
    const { definitions } = this.document
    return definitions.filter(def => {
      return (def.kind === 'ObjectTypeDefinition') &&
        Schema.getName(def) !== 'Query' &&
        Schema.getName(def) !== 'Mutation'
    }) as ObjectTypeDefinitionNode[]
  }

  getExtendedTypes(): ObjectTypeExtensionNode[] {
    const { definitions } = this.document
    return definitions.filter(def => {
      return (def.kind === 'ObjectTypeExtension') &&
        Schema.getName(def) !== 'Query' &&
        Schema.getName(def) !== 'Mutation'
    }) as ObjectTypeExtensionNode[]
  }

  getType(name: string): ObjectTypeDefinitionNode | undefined {
    return find(this.getTypes(), t => Schema.getName(t) === name)
  }

  hasType(name: string): boolean {
    return Boolean(this.getType(name))
  }

  getExtendedType(name: string): ObjectTypeExtensionNode | undefined {
    return find(this.getExtendedTypes(), t => Schema.getName(t) === name)
  }

  getTypesWithDirective(directive: string): ObjectTypeDefinitionNode[] {
    const types = this.getTypes()
    return types.filter(type => SchemaDirectives.hasDirective(type, directive))
  }

  getTypeFields(name: string) {
    const fields: any[] = []
    const type = this.getType(name)
    const extendedType = this.getExtendedType(name)
    if (!type) {
      throw new Error(`Could not find type ${ name }`)
    }
    if (type.fields) {
      for (const f of type.fields) {
        fields.push(f)
      }
    }
    if (extendedType && extendedType.fields) {
      for (const f of extendedType.fields) {
        fields.push(f)
      }
    }
    return fields
  }

  addType(type: string | DocumentNode) {
    const document = typeof type === 'string' ? gql(type) : type
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  addTypeFields(source: string | DocumentNode) {
    const document = typeof source === 'string' ? gql(source) : source
    const extendedType = Schema.getName(document.definitions[0])
    if (!extendedType) {
      throw new Error(`Can not extend undeclared type ${ extendedType }`)
    }
    const type = this.getType(extendedType)
    if (!type) {
      throw new Error(`Can not extend undeclared type ${ extendedType }`)
    }
    // @ts-ignore
    type.fields.push(...document.definitions[0].fields)
  }

  removeExtendedType(name: string) {
    const { definitions } = this.document
    const nextDefinitions = definitions.filter(
      def => !(def.kind === 'ObjectTypeExtension' && Schema.getName(def) === name)
    )
    // @ts-ignore
    this.document.definitions = nextDefinitions
  }
}