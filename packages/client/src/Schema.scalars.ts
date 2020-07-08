import Schema from "./Schema";
import { DocumentNode } from "graphql";

export default class SchemaScalars {
  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  getScalars() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'ScalarTypeDefinition')
  }
}