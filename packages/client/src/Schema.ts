import {
  DocumentNode,
  GraphQLSchema,
  buildASTSchema,
  print,
} from 'graphql'
import gql from 'graphql-tag'

import SchemaStatics from './Schema.statics'
import SchemaTypes from './Schema.types'
import SchemaQueries from './Schema.queries'
import SchemaMutations from './Schema.mutations'
import SchemaDirectives from './Schema.directives'
import SchemaScalars from './Schema.scalars'
import SchemaInputs from './Schema.inputs'
import SchemaEnumerations from './Schema.enumerations'
import SchemaFragments from './Schema.fragments'
import SchemaFields from './Schema.fields'
import SchemaKinds from './Schema.kinds'
import SchemaArguments from './Schema.arguments'
import SchemaFieldInputs from './Schema.fieldInputs'

export default class Schema extends SchemaStatics {
  private readonly document: DocumentNode
  public readonly types: SchemaTypes
  public readonly queries: SchemaQueries
  public readonly mutations: SchemaMutations
  public readonly directives: SchemaDirectives
  public readonly scalars: SchemaScalars
  public readonly inputs: SchemaInputs
  public readonly enumerations: SchemaEnumerations
  public readonly fragments: SchemaFragments
  public readonly fields: SchemaFields
  public readonly kinds: SchemaKinds
  public readonly arguments: SchemaArguments
  public readonly fieldInputs: SchemaFieldInputs

  constructor(schema: string | DocumentNode) {
    super()
    this.document = typeof schema === 'string' ? gql(schema) : { ...schema }
    this.types = new SchemaTypes(this, this.document)
    this.queries = new SchemaQueries(this, this.document)
    this.mutations = new SchemaMutations(this, this.document)
    this.directives = new SchemaDirectives(this, this.document)
    this.scalars = new SchemaScalars(this, this.document)
    this.inputs = new SchemaInputs(this, this.document)
    this.enumerations = new SchemaEnumerations(this, this.document)
    this.fragments = new SchemaFragments(this, this.document)
    this.fields = new SchemaFields(this, this.document)
    this.kinds = new SchemaKinds(this, this.document)
    this.arguments = new SchemaArguments(this, this.document)
    this.fieldInputs = new SchemaFieldInputs(this, this.document)
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
    const extendedTypes = this.types.getExtendedTypes()
    for (const extendedType of extendedTypes) {
      const typeName = Schema.getName(extendedType)
      const type = this.types.getType(typeName)
      if (!type) {
        throw new Error(`Can not extend unknown type: ${ typeName }`)
      }
      this.types.addTypeFields(print(extendedType))
      this.types.removeExtendedType(typeName)
    }

    const query = this.queries.getQueryType()

    if (query) {
      const extendedQueries = this.queries.getExtendedQueryTypes()

      for (const q of extendedQueries) {
        this.queries.addQueryFields(print(q))
      }

      this.types.removeExtendedType('Query')
    }
  }
}
