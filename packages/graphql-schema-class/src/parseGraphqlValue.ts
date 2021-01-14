import {
  getFields,
  getKind,
  getName,
  getScalar,
  getType,
  ParsedType,
  parseKind,
} from '@browserql/fpql'
import type { DocumentNode, GraphQLScalarType } from 'graphql'

const isString = (value: any) => typeof value === 'string'
const isNumber = (value: any) => typeof value === 'number'
const isBoolean = (value: any) => typeof value === 'boolean'
const isUndefined = (value: any) => typeof value === 'undefined'
const isFunction = (value: any) => typeof value === 'function'
const isNull = (value: any) => value === null

export default function parseGraphQLValue(
  value: any,
  { type, depth, nestedRequired }: ParsedType,
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
        schema
      )
    )
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
    if (isUndefined(value) || isNull(value)) {
      return null
    }

    const fields = getFields(gType)
    return fields.reduce(
      (parsed, field) => ({
        ...parsed,
        [getName(field)]:
          isUndefined(value) || isNull(value)
            ? null
            : parseGraphQLValue(
                value[getName(field)],
                parseKind(getKind(field)),
                schema
              ),
      }),
      {}
    )
  }

  const scalar = getScalar(type)(schema)

  if (scalar) {
    if (!scalars) {
      return undefined
    }

    const existingScalar = scalars[type as keyof typeof scalars]

    if (!existingScalar) {
      return null
    }

    return existingScalar.parseValue(value)
  }

  return null
}
