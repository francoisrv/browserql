import Schema from "./Schema";
import { DocumentNode } from "graphql";
import { find } from "lodash";
import gql from 'graphql-tag'

export default class SchemaInputs {
  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  getInputs() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'InputObjectTypeDefinition')
  }

  getInput(name: string) {
    return find(this.getInputs(), d => Schema.getName(d) === name)
  }

  addInput(input: string | DocumentNode) {
    const document = typeof input === 'string' ? gql(input) : input
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }
}