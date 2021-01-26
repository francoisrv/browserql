import type {
  DocumentNode,
  ObjectTypeDefinitionNode,
  GraphQLScalarType,
  InputObjectTypeDefinitionNode,
} from 'graphql'
import {
  getField,
  getFields,
  getKind,
  getName,
  parseKind,
} from '@browserql/fpql'
import parseGraphQLValue from './parseGraphqlValue'
import applyDefaults from './applyDefaults'
import getSchemaDefinition from './getSchemaDefinition'

export default class GraphqlSchemaClass<Schema = unknown> {
  static schema: DocumentNode

  static type?: string
  static input?: string

  static defaultFunctions: Record<string, () => any> = {}

  static scalars: Record<string, GraphQLScalarType> = {}

  static ignoreExtraneousFields = true

  static applyDefaults<Schema = unknown>(
    model: InstanceType<typeof GraphqlSchemaClass>
  ): Partial<Schema> {
    const fields = getFields(model.definition)
    const { defaultFunctions } = model.constructor as typeof GraphqlSchemaClass
    return applyDefaults(fields, defaultFunctions)
  }

  static ensureRequired<S = unknown>(model: GraphqlSchemaClass<S>) {
    const fields = getFields(model.definition)
    fields.forEach((field) => {
      const fieldName = getName(field)
      const kind = parseKind(getKind(field))
      const value = model.get(fieldName as keyof S)
      if (kind.required && (value === null || typeof value === 'undefined')) {
        throw new Error(
          `Error in model: ${model.constructor.name}: Missing required field ${fieldName}`
        )
      }
    })
  }

  private readonly data: Schema

  private readonly definition:
    | ObjectTypeDefinitionNode
    | InputObjectTypeDefinitionNode

  constructor(data: Partial<Schema>) {
    const { schema, type, input, ignoreExtraneousFields } = this
      .constructor as typeof GraphqlSchemaClass

    if (!schema) {
      throw new Error(`Missing schema in Model ${this.constructor.name}`)
    }

    this.definition = getSchemaDefinition(
      schema,
      type ? { type } : input ? { input } : {}
    )

    this.data = {
      ...GraphqlSchemaClass.applyDefaults<Schema>(this),
    } as Schema

    Object.keys(data).forEach((key) => {
      try {
        this.set(
          key as keyof Schema,
          data[key as keyof Schema] as Schema[keyof Schema]
        )
      } catch (error) {
        if (
          error.message === `Unknown field: ${key}` &&
          ignoreExtraneousFields
        ) {
        } else {
          throw error
        }
      }
    })

    GraphqlSchemaClass.ensureRequired(this)
  }

  get<K extends keyof Schema>(fieldName: K): Schema[K] {
    return this.data[fieldName]
  }

  set<K extends keyof Schema>(fieldName: keyof Schema, value: Schema[K]): this {
    const field = getField(fieldName as string)(this.definition)
    if (!field) {
      throw new Error(`Unknown field: ${fieldName}`)
    }
    const { schema, scalars } = this.constructor as typeof GraphqlSchemaClass
    this.data[fieldName] = parseGraphQLValue(
      value,
      parseKind(getKind(field)),
      schema,
      scalars
    ) as Schema[typeof fieldName]
    return this
  }

  toJSON(): Schema {
    return this.data
  }
}
