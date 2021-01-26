import {
  getEnumeration,
  getFields,
  getInput,
  getKind,
  getName,
  getScalar,
  getType,
  ParsedType,
  parseKind,
} from '@browserql/fpql'
import type {
  DocumentNode,
  GraphQLScalarType,
  InputObjectTypeDefinitionNode,
} from 'graphql'

const isString = (value: any) => typeof value === 'string'
const isNumber = (value: any) => typeof value === 'number'
const isBoolean = (value: any) => typeof value === 'boolean'
const isUndefined = (value: any) => typeof value === 'undefined'
const isFunction = (value: any) => typeof value === 'function'
const isNull = (value: any) => value === null

export default function parseGraphQLValue(
  value: any,
  { type, depth, nestedRequired, defaultValue }: ParsedType,
  schema: DocumentNode,
  scalars?: Record<string, GraphQLScalarType>
): any {
  if (depth) {
    if (!Array.isArray(value)) {
      return null
    }
    const nextNestedRequired = [...nestedRequired]
    const nextRequired = nextNestedRequired.shift()
    return value.map((v) =>
      parseGraphQLValue(
        v,
        {
          type,
          required: Boolean(nextRequired),
          depth: depth - 1,
          nestedRequired: nextNestedRequired,
        },
        schema,
        scalars
      )
    )
  }

  if (isUndefined(value) || isNull(value)) {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue
    }
    return null
  }

  // eslint-disable-next-line default-case
  switch (type) {
    case 'String':
    case 'ID': {
      if (isString(value)) {
        return value
      }
      if (isUndefined(value) || isNull(value)) {
        return null
      }
      if (isFunction(value.toString)) {
        return value.toString()
      }
      return null
    }

    case 'Int':
    case 'Float': {
      if (isNumber(value)) {
        return value
      }
      if (isUndefined(value) || isNull(value)) {
        return null
      }
      if (isString(value)) {
        const num = Number(value)

        if (Number.isNaN(num)) {
          return null
        }

        return num
      }
    }

    // eslint-disable-next-line no-fallthrough
    case 'Boolean': {
      if (isBoolean(value)) {
        return value
      }
      if (isUndefined(value) || isNull(value)) {
        return null
      }
      return null
    }
  }

  const gType = getType(type)(schema)

  if (gType) {
    const fields = getFields(gType)
    return fields.reduce(
      (parsed, field) => ({
        ...parsed,
        [getName(field)]: parseGraphQLValue(
          value[getName(field)],
          parseKind(getKind(field)),
          schema,
          scalars
        ),
      }),
      {}
    )
  }

  const gInput = getInput(type)(schema)

  if (gInput) {
    const fields = getFields(gInput as InputObjectTypeDefinitionNode)
    return fields.reduce(
      (parsed, field) => ({
        ...parsed,
        [getName(field)]: parseGraphQLValue(
          value[getName(field)],
          parseKind(getKind(field)),
          schema,
          scalars
        ),
      }),
      {}
    )
  }

  const geEnum = getEnumeration(type)(schema)

  if (geEnum) {
    return value
  }

  const scalar = getScalar(type)(schema)

  if (scalar) {
    if (!scalars) {
      return null
    }

    const existingScalar = scalars[type as keyof typeof scalars]

    if (!existingScalar) {
      return null
    }

    return existingScalar.parseValue(value)
  }

  return null
}
