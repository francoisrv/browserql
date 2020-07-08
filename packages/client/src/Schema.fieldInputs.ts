import Schema from "./Schema";
import { DocumentNode, InputValueDefinitionNode } from "graphql";
import SchemaKinds from "./Schema.kinds";

export default class SchemaFieldInputs {
  static buildFieldInput(name: string, kind: string): InputValueDefinitionNode {
    return {
      kind: 'InputValueDefinition',
      name: { kind: 'Name', value: name },
      type: SchemaKinds.buildKind(kind)
    }
  }

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}
}
