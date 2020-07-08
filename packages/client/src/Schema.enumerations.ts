import Schema from "./Schema";
import { DocumentNode } from "graphql";
import { find } from "lodash";
import gql from 'graphql-tag'

export default class SchemaEnumerations {
  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  addEnum(enumeration: string | DocumentNode) {
    const document = typeof enumeration === 'string' ? gql(enumeration) : enumeration
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  getEnumerations() {
    const { definitions } = this.document
    return definitions.filter(f => f.kind === 'EnumTypeDefinition')
  }

  getEnumeration(name: string) {
    return find(this.getEnumerations(), e => Schema.getName(e) === name)
  }
}