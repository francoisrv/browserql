import Schema from "./Schema";
import { DocumentNode, ArgumentNode } from "graphql";
import SchemaKinds from "./Schema.kinds";

export default class SchemaArguments {
  static buildArgument(name: string, kind: string): ArgumentNode {
    return {
      kind: 'Argument',
      name: { kind: 'Name', value: name },
    }
  }

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}
}