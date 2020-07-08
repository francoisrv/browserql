import Schema from "./Schema";
import { DocumentNode, FieldDefinitionNode } from "graphql";

export default class SchemaFields {

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}
}