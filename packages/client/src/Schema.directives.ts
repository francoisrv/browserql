import Schema from "./Schema";
import { DocumentNode } from "graphql";
import { find } from "lodash";
import gql from 'graphql-tag'

export default class SchemaDirectives {
  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  addDirective(directive: string | DocumentNode) {
    const document = typeof directive === 'string' ? gql(directive) : directive
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  getDirectives() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'DirectiveDefinition')
  }

  getDirective(name: string) {
    return find(this.getDirectives(), d => Schema.getName(d) === name)
  }
}