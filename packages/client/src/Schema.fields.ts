import Schema from "./Schema";
import { DocumentNode, FieldDefinitionNode } from "graphql";

export default class SchemaFields {
  static buildField(name: string): FieldDefinitionNode {
    return {
      kind: 'FieldDefinition',
      name: { kind: 'Name', value: name }
      type: {}
    }
  }

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}
}