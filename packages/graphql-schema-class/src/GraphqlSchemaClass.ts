import type {
  DocumentNode,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  GraphQLScalarType,
} from 'graphql'
import {
  getArgument,
  getDirective,
  getField,
  getFields,
  getKind,
  getName,
  getType,
  getValue,
  parseKind,
} from '@browserql/fpql'
import parseGraphQLValue from './parseGraphqlValue'

export default class GraphqlSchemaClass<Schema = unknown> {
  static schema: DocumentNode

  static type?: string

  static defaultFunctions: Record<string, () => any> = {}

  static scalars: Record<string, GraphQLScalarType> = {}

  static applyDefaults<Schema = unknown>(
    model: InstanceType<typeof GraphqlSchemaClass>
  ): Partial<Schema> {
    const fields = getFields(model.type)
    return fields.reduce((defaults, field) => {
      const fieldName = getName(field)
      const defaultDirective = getDirective('default')(
        field as FieldDefinitionNode
      )
      const { required } = parseKind(getKind(field))

      if (defaultDirective) {
        const argValue = getArgument('value')(defaultDirective)
        const argFn = getArgument('function')(defaultDirective)

        if (argValue) {
          const value = getValue(argValue)
          return {
            ...defaults,
            [fieldName]: value,
          }
        }

        if (argFn) {
          const fn = getValue(argFn)
          const defaultFunction = (model.constructor as typeof GraphqlSchemaClass)
            .defaultFunctions[
            fn as keyof typeof GraphqlSchemaClass.defaultFunctions
          ]
          if (!defaultFunction) {
            throw new Error(`No such default function: ${fn}`)
          }
          return {
            ...defaults,
            [fieldName]: defaultFunction(),
          }
        }
      }

      if (!required) {
        return {
          ...defaults,
          [fieldName]: null,
        }
      }

      return defaults
    }, {})
  }

  static ensureRequired<S = unknown>(model: GraphqlSchemaClass<S>) {
    const fields = getFields(model.type)
    fields.forEach((field) => {
      const fieldName = getName(field)
      const kind = parseKind(getKind(field))
      const value = model.get(fieldName as keyof S)
      if (kind.required && (value === null || value === undefined)) {
        throw new Error(
          `Error in model: ${model.constructor.name}: Missing required field ${fieldName}`
        )
      }
    })
  }

  private readonly data: Schema

  private readonly type: ObjectTypeDefinitionNode

  constructor(data: Partial<Schema>) {
    const { schema, type: typeName } = this
      .constructor as typeof GraphqlSchemaClass

    if (!schema) {
      throw new Error(`Missing schema in Model ${this.constructor.name}`)
    }

    if (typeName) {
      const type = getType(typeName)(schema)

      if (!type) {
        throw new Error(`Could not find type ${typeName} in schema`)
      }

      this.type = type as ObjectTypeDefinitionNode
    } else {
      const [type] = schema.definitions

      if (type.kind !== 'ObjectTypeDefinition') {
        throw new Error(
          `Was expecting an Object Type, instead got ${type.kind}`
        )
      }

      this.type = type as ObjectTypeDefinitionNode
    }

    this.data = {
      ...GraphqlSchemaClass.applyDefaults<Schema>(this),
      ...data,
    } as Schema

    Object.keys(data).forEach((key) => {
      this.set(key as keyof Schema, this.data[key as keyof Schema])
    })

    GraphqlSchemaClass.ensureRequired(this)
  }

  get<K extends keyof Schema>(fieldName: K): Schema[K] {
    return this.data[fieldName]
  }

  set<K extends keyof Schema>(fieldName: keyof Schema, value: Schema[K]): this {
    const field = getField(fieldName as string)(this.type)
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
