import Schema from "./Schema";
import { DocumentNode, TypeNode, parse, parseType } from "graphql";
import SchemaTypes from "./Schema.types";
import { isString } from "lodash";

export default class SchemaKinds {
  /**
   * Build a source to a type node
   * @param source string
   * @returns TypeNode
   */
  static buildKind(source: string): TypeNode {
    return parseType(source)
  }

  /**
   * Print a type node
   * @param type {TypeNode} 
   */
  static printKind(type: TypeNode): string {
    if (type.kind === 'NamedType') {
      return Schema.getName(type) as string
    }
    if (type.kind === 'NonNullType') {
      return `${ SchemaKinds.printKind(type.type) } !`
    }
    if (type.kind === 'ListType') {
      return `[ ${ SchemaKinds.printKind(type.type) } ]`
    }
    return 'Unknown'
  }

  /**
   * Print the type name only (without [] and !)
   * @param type {TypeNode}
   */
  static printEndKind(type: TypeNode | string): string {
    return (isString(type) ? type : SchemaKinds.printKind(type))
      .replace(/!/g, '')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .trim()
  }

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}
}