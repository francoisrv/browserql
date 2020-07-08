import Schema from "./Schema";
import { DocumentNode, TypeNode, parse, parseType } from "graphql";

export default class SchemaKinds {
  static buildKind(kind: string): TypeNode {
    return parseType(kind)
  }

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}
}