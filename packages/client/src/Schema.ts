import {
  ArgumentNode,
  DefinitionNode,
  DocumentNode,
  FieldDefinitionNode,
  GraphQLSchema,
  InputValueDefinitionNode,
  ObjectFieldNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
  buildASTSchema,
  parse,
  parseType,
  print,
  TypeDefinitionNode,
  TypeNode,
} from 'graphql'
import gql from 'graphql-tag'
import find from 'lodash.find'

export default class Schema {
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
  ) {
    if ('name' in type) {
      return type.name?.value
    }
    return undefined
  }

  /**
   * Print a type node
   * @param type {TypeNode} 
   */
  static printType(type: TypeNode): string {
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

  /**
   * Print the type name only (without [] and !)
   * @param type {TypeNode}
   */
  static printEndType(type: any): string {
    return Schema.printType(type)
      .replace(/!/g, '')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .trim()
  }

  private readonly document: DocumentNode

  constructor(schema: string | DocumentNode) {
    this.document = typeof schema === 'string' ? gql(schema) : schema
  }

  toString() {
    return print(this.document)
  }

  toAST(): GraphQLSchema {
    return buildASTSchema(this.document)
  }

  getTypes(): ObjectTypeDefinitionNode[] {
    const { definitions } = this.document
    return definitions.filter(def => {
      return (def.kind === 'ObjectTypeDefinition') &&
        Schema.getName(def) !== 'Query' &&
        Schema.getName(def) !== 'Mutation'
    }) as ObjectTypeDefinitionNode[]
  }

  getExtendedTypes(): ObjectTypeExtensionNode[] {
    const { definitions } = this.document
    return definitions.filter(def => {
      return (def.kind === 'ObjectTypeExtension') &&
        Schema.getName(def) !== 'Query' &&
        Schema.getName(def) !== 'Mutation'
    }) as ObjectTypeExtensionNode[]
  }

  getType(name: string): ObjectTypeDefinitionNode | undefined {
    return find(this.getTypes(), t => Schema.getName(t) === name)
  }

  getExtendedType(name: string): ObjectTypeExtensionNode | undefined {
    return find(this.getExtendedTypes(), t => Schema.getName(t) === name)
  }

  getTypesWithDirective(directive: string): ObjectTypeDefinitionNode[] {
    const types = this.getTypes()
    return types.filter(type => Schema.hasDirective(type, directive))
  }

  getTypeFields(name: string) {
    const fields: any[] = []
    const type = this.getType(name)
    const extendedType = this.getExtendedType(name)
    if (!type) {
      throw new Error(`Could not find type ${ name }`)
    }
    if (type.fields) {
      for (const f of type.fields) {
        fields.push(f)
      }
    }
    if (extendedType && extendedType.fields) {
      for (const f of extendedType.fields) {
        fields.push(f)
      }
    }
    return fields
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

  addQuery(query: string | DocumentNode) {
    const document = typeof query === 'string' ? gql(query) : query
    if (this.getQueryType()) {
      // @ts-ignore definitions are read-only
      document.definitions[0].kind = 'ObjectTypeExtension'
    } else {
      // @ts-ignore definitions are read-only
      document.definitions[0].kind = 'ObjectTypeDefinition'
    }
    // @ts-ignore
    this.document.definitions.push(document.definitions[0])
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

  getQueriesWithDirective(directive: string) {
    const queries = this.getQueries()
    return queries.filter(query => Schema.hasDirective(query, directive))
  }

  addTypeFields(source: string | DocumentNode) {
    const document = typeof source === 'string' ? gql(source) : source
    const extendedType = Schema.getName(document.definitions[0])
    if (!extendedType) {
      throw new Error(`Can not extend undeclared type ${ extendedType }`)
    }
    const type = this.getType(extendedType)
    if (!type) {
      throw new Error(`Can not extend undeclared type ${ extendedType }`)
    }
    // @ts-ignore
    type.fields.push(...document.definitions[0].fields)
  }
}
