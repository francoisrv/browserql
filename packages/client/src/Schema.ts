import { DocumentNode, print, DefinitionNode, parseType, ObjectFieldNode, ArgumentNode, FieldDefinitionNode, buildASTSchema, InputValueDefinitionNode, ObjectTypeDefinitionNode, parse, TypeDefinitionNode, isObjectType } from 'graphql'
import gql from 'graphql-tag'
import find from 'lodash.find'

interface Query {
  description?: string
}

interface Field {
  name: string
  description?: string
  kind: string
}

interface Argument {
  name: string
  description?: string
  kind: string
  defaultValue?: any
}

interface Directive {
  name: string
  locations: {
    type?: boolean
  }
  arguments?: Argument[]
  description?: string
  repeatable?: boolean
}

export default class Schema {
  static hasDirective(type: DefinitionNode, directive: string) {
    if (('directives' in type)) {
      const { directives } = type
      if (Array.isArray(directives) && directives.length) {
        return Boolean(find(directives, d => d.name.value === directive))
      }
    }
    return false
  }

  static getName(type: DefinitionNode | ObjectFieldNode | ArgumentNode | FieldDefinitionNode | InputValueDefinitionNode) {
    if ('name' in type) {
      return type.name?.value
    }
    return undefined
  }

  static buildField(field: Field) {
    return {
      kind: 'FieldDefinition',
      description: field.description,
      name: { kind: 'Name', value: field.name },
      arguments: [],
      type: parseType(field.kind),
      directives: []
    }
  }

  static buildDirective(directive: Directive | string) {
    if (typeof directive === 'string') {
      return parse(directive)
    }
    const locations = []
    if (directive.locations.type) {
      locations.push({ kind: 'Name', value: 'OBJECT' })
    }
    return {
      kind: 'DirectiveDefinition',
      description: directive.description,
      name: { kind: 'Name', value: directive.name },
      arguments: (directive.arguments || []).map(Schema.buildArgument),
      repeatable: !!directive.repeatable,
      locations
    }
  }

  static buildArgument(argument: Argument) {
    return {
      kind: 'InputValueDefinition',
      description: argument.description,
      name: { kind: 'Name', value: argument.name },
      directives: [],
      defaultValue: argument.defaultValue,
      type: parseType(argument.kind)
    }
  }

  static printType(type: any): string {
    if (type.kind === 'NamedType') {
      return Schema.getName(type) as string
    }
    if (type.kind === 'NonNullType') {
      return `${ Schema.printType(type.type) } !`
    }
    if (type.kind === 'ListType') {
      return `[ ${ Schema.printType(type.type) } ]`
    }
    return 'Unknown'
  }

  static printEndType(type: any): string {
    return Schema.printType(type)
      .replace(/!/g, '')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .trim()
  }

  document: DocumentNode

  constructor(schema: string | DocumentNode) {
    this.document = typeof schema === 'string' ? gql(schema) : schema
  }

  toString() {
    return print(this.document)
  }

  toAST() {
    return buildASTSchema(this.document)
  }

  getTypes() {
    const { definitions } = this.document
    return definitions.filter(def => {
      return def.kind === 'ObjectTypeDefinition' &&
        Schema.getName(def) !== 'Query' &&
        Schema.getName(def) !== 'Mutation'
    })
  }

  getType(name: string) {
    return find(this.getTypes(), t => Schema.getName(t) === name)
  }

  getTypesWithDirective(directive: string) {
    const types = this.getTypes()
    return types.filter(type => Schema.hasDirective(type, directive))
  }

  getQueryType() {
    const { definitions } = this.document
    return find(
      definitions,
      def => def.kind === 'ObjectTypeDefinition' && Schema.getName(def) === 'Query'
    )
  }

  getExtendedQueryTypes() {
    const { definitions } = this.document
    return definitions.filter(
      def => def.kind === 'ObjectTypeExtension' && Schema.getName(def) === 'Query'
    )
  }

  getMutationType() {
    const { definitions } = this.document
    return find(
      definitions,
      def => def.kind === 'ObjectTypeDefinition' && Schema.getName(def) === 'Mutation'
    )
  }

  getQueries(): FieldDefinitionNode[] {
    const queries: FieldDefinitionNode[] = []
    const queryType = this.getQueryType()
    if (queryType) {
      // @ts-ignore
      queries.push(...queryType.fields)
    }
    const extendedQueries = this.getExtendedQueryTypes()
    extendedQueries.forEach(q => {
      // @ts-ignore
      queries.push(...q.fields)
    })
    return queries
  }

  addQueryType(queryType: Query = {}) {
    // @ts-ignore
    this.document.definitions.push({
      kind: 'ObjectTypeDefinition',
      description: queryType.description,
      name: {
        kind: 'Name',
        value: 'Query'
      },
      directives: [],
      fields: []
    })
  }

  addQuery(query: string | DocumentNode) {
    if (!this.getQueryType()) {
      this.addQueryType()
    }
    const extendedQuery = typeof query === 'string' ? gql(query) : query
    // @ts-ignore
    this.document.definitions.push(extendedQuery.definitions[0])
  }

  addDirective(directive: string | DocumentNode) {
    const document = typeof directive === 'string' ? gql(directive) : directive
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  getScalars() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'ScalarTypeDefinition')
  }

  getDirectives() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'DirectiveDefinition')
  }

  getDirective(name: string) {
    return find(this.getDirectives(), d => Schema.getName(d) === name)
  }

  getInputs() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'InputObjectTypeDefinition')
  }

  getInput(name: string) {
    return find(this.getInputs(), d => Schema.getName(d) === name)
  }

  addType(type: string | DocumentNode) {
    const document = typeof type === 'string' ? gql(type) : type
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  addEnum(enumeration: string | DocumentNode) {
    const document = typeof enumeration === 'string' ? gql(enumeration) : enumeration
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  addInput(input: string | DocumentNode) {
    const document = typeof input === 'string' ? gql(input) : input
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  extend(schema: string | DocumentNode) {
    const document = typeof schema === 'string' ? gql(schema) : schema
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }
}