import Schema from "./Schema";
import { DocumentNode, ArgumentNode } from "graphql";
import SchemaKinds from "./Schema.kinds";

export default class SchemaArguments {
  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}
}