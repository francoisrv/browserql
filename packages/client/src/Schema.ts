import { DocumentNode, print, DefinitionNode, parseType } from 'graphql'
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

  static getName(type: DefinitionNode) {
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

  static buildDirective(directive: Directive) {
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

  document: DocumentNode

  constructor(schema: string | DocumentNode) {
    this.document = typeof schema === 'string' ? gql(schema) : schema
  }

  toString() {
    return print(this.document)
  }

  getTypes() {
    const { definitions } = this.document
    return definitions.filter(def => {
      return def.kind === 'ObjectTypeDefinition' &&
        Schema.getName(def) !== 'Query' &&
        Schema.getName(def) !== 'Mutation'
    })
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

  getQueries() {
    const queryType = this.getQueryType()
    if (queryType) {
      return queryType.fields
    }
    return []
  }

  addQueryType(queryType: Query = {}) {
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

  addQuery(query: Field) {
    if (!this.getQueryType()) {
      this.addQueryType()
    }
    const queryType = this.getQueryType()
    queryType.fields.push(Schema.buildField(query))
  }

  addDirective(directive: Directive) {
    this.document.definitions.push(Schema.buildDirective(directive))
  }
}