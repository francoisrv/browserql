import Schema from "./Schema";
import { DocumentNode, DefinitionNode, FieldDefinitionNode, ArgumentNode } from "graphql";
import { find } from "lodash";
import gql from 'graphql-tag'

export default class SchemaDirectives {
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
      const name = Schema.getName(arg)
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
          return SchemaDirectives.parseDirectiveParams(directive.arguments)
        }
      }
    }
    return params
  }

  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  addDirective(directive: string | DocumentNode) {
    const document = typeof directive === 'string' ? gql(directive) : directive
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  getDirectives() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'DirectiveDefinition')
  }

  getDirective(name: string) {
    return find(this.getDirectives(), d => Schema.getName(d) === name)
  }
}