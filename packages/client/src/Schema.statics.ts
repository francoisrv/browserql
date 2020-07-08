import { DefinitionNode, FieldDefinitionNode, ArgumentNode, InputValueDefinitionNode, ObjectFieldNode, TypeNode, SelectionNode } from "graphql"
import { find } from "lodash"

export default class SchemaStatics {
  /**
   * Either a type has a directive or not
   * @param type {DefinitionNode} The node to examine
   * @param directive The name of the directive to look for
   */
  static hasDirective(
    type:
    | DefinitionNode
    | FieldDefinitionNode,
    directive: string
  ) {
    if (('directives' in type)) {
      const { directives } = type
      if (Array.isArray(directives) && directives.length) {
        return Boolean(find(directives, d => d.name.value === directive))
      }
    }
    return false
  }

  static parseDirectiveParams(args: ArgumentNode[]) {
    const params: { [name: string]: any } = {}
    for (const arg of args) {
      const name = SchemaStatics.getName(arg)
      if (arg.value.kind === 'StringValue') {
        params[name] = arg.value.value
      } else if (arg.value.kind === 'IntValue') {
        params[name] = Number(arg.value.value)
      } else if (arg.value.kind === 'FloatValue') {
        params[name] = Number(arg.value.value)
      } else if (arg.value.kind === 'BooleanValue') {
        params[name] = Boolean(arg.value.value)
      }
    }
    return params
  }

  static parseArguments(args: InputValueDefinitionNode[]) {
    const params: { [name: string]: any } = {}
    for (const arg of args) {
      console.log(arg)
      const name = SchemaStatics.getName(arg)
      // if (arg.type.kind === 'StringValue') {
      //   params[name] = arg.value.value
      // } else if (arg.value.kind === 'IntValue') {
      //   params[name] = Number(arg.value.value)
      // } else if (arg.value.kind === 'FloatValue') {
      //   params[name] = Number(arg.value.value)
      // } else if (arg.value.kind === 'BooleanValue') {
      //   params[name] = Boolean(arg.value.value)
      // }
    }
    return params
  }

  static getParams(type: FieldDefinitionNode) {
    // console.log(type.arguments)
    // @ts-ignore
    return SchemaStatics.parseArguments(type.arguments || [])
  }

  static getDirectiveParams(
    type:
    | DefinitionNode
    | FieldDefinitionNode,
    directiveName: string
  ) {
    const params: { [name: string]: any } = {}
    if (('directives' in type)) {
      const { directives } = type
      if (Array.isArray(directives) && directives.length) {
        const directive = find(directives, d => d.name.value === directiveName)
        if (directive && directive.arguments) {
          return SchemaStatics.parseDirectiveParams(directive.arguments)
        }
      }
    }
    return params
  }

  /**
   * Get a node's name
   * @param type {Node}
   */
  static getName(
    type:
    | ArgumentNode
    | DefinitionNode
    | FieldDefinitionNode
    | InputValueDefinitionNode
    | ObjectFieldNode
    | TypeNode
    | SelectionNode
  ): string {
    if ('name' in type) {
      const { name } = type
      if (name) {
        return name.value
      }
    }
    throw new Error('Could not get name from type')
  }

  /**
   * Print a type node
   * @param type {TypeNode} 
   */
  static printType(type: TypeNode): string {
    if (type.kind === 'NamedType') {
      return SchemaStatics.getName(type) as string
    }
    if (type.kind === 'NonNullType') {
      return `${ SchemaStatics.printType(type.type) } !`
    }
    if (type.kind === 'ListType') {
      return `[ ${ SchemaStatics.printType(type.type) } ]`
    }
    return 'Unknown'
  }

  /**
   * Print the type name only (without [] and !)
   * @param type {TypeNode}
   */
  static printEndType(type: any): string {
    return SchemaStatics.printType(type)
      .replace(/!/g, '')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .trim()
  }
}