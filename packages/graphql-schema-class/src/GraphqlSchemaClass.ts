import type {
  DocumentNode,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
} from 'graphql'
import {
  getArgument,
  getDirective,
  getField,
  getFields,
  getKind,
  getName,
  getValue,
  parseKind,
} from '@browserql/fpql'
import parseGraphQLValue from './parseGraphqlValue'

export default abstract class GraphqlSchemaClass<Schema = unknown> {
  static schema: DocumentNode

  static defaultFunctions: Record<string, () => any> = {}

  static applyDefaults<V>(type: ObjectTypeDefinitionNode): Partial<V> {
    const fields = getFields(type)
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
          const defaultFunction =
            GraphqlSchemaClass.defaultFunctions[
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

  readonly data: Schema

  readonly type: ObjectTypeDefinitionNode

  constructor(data: Partial<Schema>) {
    const { schema } = this.constructor as typeof GraphqlSchemaClass

    if (!schema) {
      throw new Error(`Missing schema in Model ${this.constructor.name}`)
    }

    const [type] = schema.definitions

    if (type.kind !== 'ObjectTypeDefinition') {
      throw new Error(`Was expecting an Object Type, instead got ${type.kind}`)
    }

    this.type = type as ObjectTypeDefinitionNode
    this.data = {
      ...GraphqlSchemaClass.applyDefaults(this.type),
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
    const { schema } = this.constructor as typeof GraphqlSchemaClass
    this.data[fieldName] = parseGraphQLValue(
      value,
      parseKind(getKind(field)),
      schema
    ) as Schema[typeof fieldName]
    return this
  }

  toJSON(): Schema {
    return this.data
  }
}
