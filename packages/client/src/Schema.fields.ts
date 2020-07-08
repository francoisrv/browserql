import Schema from "./Schema";
import { DocumentNode, FieldDefinitionNode } from "graphql";
import SchemaKinds from "./Schema.kinds";
import SchemaFieldInputs from "./Schema.fieldInputs";

interface BuildFieldOptions {
  inputs?: Parameters<typeof SchemaFieldInputs.buildFieldInput>[]
}

export default class SchemaFields {

  static buildField(name: string, kind: string, options: BuildFieldOptions = {}): FieldDefinitionNode {
    const field: FieldDefinitionNode = {
      kind: 'FieldDefinition',
      name: { kind: 'Name', value: name },
      type: SchemaKinds.buildKind(kind),
      arguments: (options.inputs || []).map(args => SchemaFieldInputs.buildFieldInput(...args))
    }
    return field
  }

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}
}