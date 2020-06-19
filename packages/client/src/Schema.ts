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
  print,
  TypeNode,
  InputObjectTypeDefinitionNode,
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

  static parseArguments(args: InputValueDefinitionNode[]) {
    const params: { [name: string]: any } = {}
    for (const arg of args) {
      console.log(arg)
      const name = Schema.getName(arg)
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
    return Schema.parseArguments(type.arguments || [])
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
          return Schema.parseDirectiveParams(directive.arguments)
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

  static isType(type: any) {
    return type.kind === 'ObjectTypeDefinition'
  }

  private readonly document: DocumentNode

  constructor(schema: string | DocumentNode) {
    this.document = typeof schema === 'string' ? gql(schema) : { ...schema }
  }

  toString() {
    this.merge()
    return print(this.document)
  }

  toAST(): GraphQLSchema {
    this.merge()
    return buildASTSchema(this.document)
  }

  extend(schema: string | DocumentNode) {
    const document = typeof schema === 'string' ? gql(schema) : schema
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
    this.merge()
  }

  merge() {
    const extendedTypes = this.getExtendedTypes()
    for (const extendedType of extendedTypes) {
      const typeName = Schema.getName(extendedType)
      const type = this.getType(typeName)
      if (!type) {
        throw new Error(`Can not extend unknown type: ${ typeName }`)
      }
      this.addTypeFields(print(extendedType))
      this.removeExtendedType(typeName)
    }

    const query = this.getQueryType()

    if (query) {
      const extendedQueries = this.getExtendedQueryTypes()

      for (const q of extendedQueries) {
        this.addQueryFields(print(q))
      }

      this.removeExtendedType('Query')
    }
  }

  /* 
      *****************************************************************************************
      TYPES
      *****************************************************************************************
  */

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

  addType(type: string | DocumentNode) {
    const document = typeof type === 'string' ? gql(type) : type
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
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

  removeExtendedType(name: string) {
    const { definitions } = this.document
    const nextDefinitions = definitions.filter(
      def => !(def.kind === 'ObjectTypeExtension' && Schema.getName(def) === name)
    )
    // @ts-ignore
    this.document.definitions = nextDefinitions
  }

  /* 
      *****************************************************************************************
      QUERIES
      *****************************************************************************************
  */

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

  getQuery(name: string): FieldDefinitionNode | undefined {
    const queries = this.getQueries()
    return find(queries, query => Schema.getName(query) === name)
  }

  getQueriesWithDirective(directive: string) {
    const queries = this.getQueries()
    return queries.filter(query => Schema.hasDirective(query, directive))
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

  addQueryFields(source: string | DocumentNode) {
    const document = typeof source === 'string' ? gql(source) : source
    const extendedType = Schema.getName(document.definitions[0])
    if (!extendedType) {
      throw new Error(`Can not extend undeclared type ${ extendedType }`)
    }
    const type = this.getQueryType()
    if (!type) {
      throw new Error(`Can not extend undeclared type ${ extendedType }`)
    }
    // @ts-ignore
    type.fields.push(...document.definitions[0].fields)
  }

  /* 
      *****************************************************************************************
      MUTATIONS
      *****************************************************************************************
  */

  getMutationType() {
    const { definitions } = this.document
    return find(
      definitions,
      def => def.kind === 'ObjectTypeDefinition' && Schema.getName(def) === 'Mutation'
    )
  }

  getMutations(): FieldDefinitionNode[] {
    const mutations: FieldDefinitionNode[] = []
    const mutationType = this.getMutationType()
    if (mutationType) {
      // @ts-ignore
      mutations.push(...mutationType.fields)
    }
    const extendedMutations = this.getExtendedQueryTypes()
    extendedMutations.forEach(q => {
      // @ts-ignore
      mutations.push(...q.fields)
    })
    return mutations
  }

  addMutation(mutation: string | DocumentNode) {
    const document = typeof mutation === 'string' ? gql(mutation) : mutation
    if (this.getMutationType()) {
      // @ts-ignore definitions are read-only
      document.definitions[0].kind = 'ObjectTypeExtension'
    } else {
      // @ts-ignore definitions are read-only
      document.definitions[0].kind = 'ObjectTypeDefinition'
    }
    // @ts-ignore
    this.document.definitions.push(document.definitions[0])
  }

  /* 
      *****************************************************************************************
      DIRECTIVES
      *****************************************************************************************
  */

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

  /* 
      *****************************************************************************************
      SCALARS
      *****************************************************************************************
  */

  getScalars() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'ScalarTypeDefinition')
  }

  /* 
      *****************************************************************************************
      INPUTS
      *****************************************************************************************
  */

  getInputs() {
    const { definitions } = this.document
    return definitions.filter(d => d.kind === 'InputObjectTypeDefinition')
  }

  getInput(name: string) {
    return find(this.getInputs(), d => Schema.getName(d) === name)
  }

  addInput(input: string | DocumentNode) {
    const document = typeof input === 'string' ? gql(input) : input
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  /* 
      *****************************************************************************************
      ENUMERATIONS
      *****************************************************************************************
  */

  addEnum(enumeration: string | DocumentNode) {
    const document = typeof enumeration === 'string' ? gql(enumeration) : enumeration
    // @ts-ignore
    this.document.definitions.push(...document.definitions)
  }

  getEnumerations() {
    const { definitions } = this.document
    return definitions.filter(f => f.kind === 'EnumTypeDefinition')
  }

  getEnumeration(name: string) {
    return find(this.getEnumerations(), e => Schema.getName(e) === name)
  }
}
