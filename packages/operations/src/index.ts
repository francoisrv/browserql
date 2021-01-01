import type {
  DocumentNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql'
import {
  getArguments,
  getDefaultValue,
  getField,
  getKind,
  getMutation,
  getName,
  getQuery,
  getType,
  parseKind,
} from '@browserql/fpql'
import { buildFragment } from '@browserql/fragments'
import gql from 'graphql-tag'

export function buildOperationString(
  schema: DocumentNode,
  path: string
): string | undefined {
  const [typeName, fieldName] = path.split(/\./)
  const type = getType(typeName)(schema)
  if (!type) {
    console.warn(`Type not found in schema: ${typeName}`)
    return undefined
  }
  const field = getField(fieldName)(type) as FieldDefinitionNode
  if (!field) {
    console.warn(`Field not found in schema: ${path}`)
    return undefined
  }
  const parsedType = parseKind(getKind(field))
  const isType = getType(parsedType.type)(schema)
  let selection = ''
  if (isType) {
    const fragment = buildFragment(schema, parsedType.type).trim()
    selection = fragment
      .replace(/^fragment .+ \{/, '{')
      .split('\n')
      .map((line) => `      ${line}`)
      .join('\n')
      .trim()
  }

  let definitions = ''
  let variables = ''
  const args = getArguments(field) as InputValueDefinitionNode[]
  if (Array.isArray(args) && args.length > 0) {
    definitions = `(\n${args
      .map((arg) => {
        let string = `  $${getName(arg)}: ${getKind(arg)}`
        const val = getDefaultValue(arg)
        if (typeof val !== 'undefined') {
          string += ` = ${JSON.stringify(val, null, 2)}`
        }
        return string
      })
      .join('\n')}\n)`
    variables = `(\n${args
      .map((arg) => {
        let string = `    ${getName(arg)}: $${getName(arg)}`
        return string
      })
      .join('\n')}\n  )`
  }
  return `${definitions}  {
  ${fieldName}${variables} ${selection}
}`
}

export function buildQueryString(
  schema: DocumentNode,
  queryName: string
): string {
  const query = getQuery(queryName)(schema)
  if (!query) {
    throw new Error(`No such query: ${queryName}`)
  }
  const { type } = parseKind(getKind(query))
  const isType = getType(type)(schema)
  let selection = ''
  if (isType) {
    const fragment = buildFragment(schema, type).trim()
    selection = fragment.replace(/^fragment .+ \{/, '{')
  }
  let definitions = ''
  let variables = ''
  const args = getArguments(query) as InputValueDefinitionNode[]
  if (Array.isArray(args) && args.length > 0) {
    definitions = `Query (${args
      .map((arg) => {
        let string = `$${getName(arg)}: ${getKind(arg)}`
        const val = getDefaultValue(arg)
        if (typeof val !== 'undefined') {
          string += ` = ${JSON.stringify(val, null, 2)}`
        }
        return string
      })
      .join('\n')})`
    variables = `(${args
      .map((arg) => {
        let string = `${getName(arg)}: $${getName(arg)}`
        return string
      })
      .join('\n')})`
  }
  return `
    query ${definitions} {
      ${queryName}${variables} ${selection}
    }
  `
}

export function buildQuery(
  schema: DocumentNode,
  queryName: string
): DocumentNode {
  return gql(buildQueryString(schema, queryName))
}

export function buildMutationString(
  schema: DocumentNode,
  mutationName: string
): string {
  const mutation = getMutation(mutationName)(schema)
  if (!mutation) {
    throw new Error(`No such mutation: ${mutationName}`)
  }
  const { type } = parseKind(getKind(mutation))
  const isType = getType(type)(schema)
  let selection = ''
  if (isType) {
    const fragment = buildFragment(schema, type).trim()
    selection = fragment.replace(/^fragment .+ \{/, '{')
  }
  let definitions = ''
  let variables = ''
  const args = getArguments(mutation) as InputValueDefinitionNode[]
  if (Array.isArray(args) && args.length > 0) {
    definitions = `Mutation (${args
      .map((arg) => `$${getName(arg)}: ${getKind(arg)}`)
      .join('\n')})`
    variables = `(${args
      .map((arg) => `${getName(arg)}: $${getName(arg)}`)
      .join('\n')})`
  }
  return `
    mutation ${definitions} {
      ${mutationName}${variables} ${selection}
    }
  `
}

export function buildMutation(
  schema: DocumentNode,
  mutationName: string
): DocumentNode {
  return gql(buildMutationString(schema, mutationName))
}

export function buildCompoundQuery(
  schema: DocumentNode,
  variables: Record<string, string>,
  ...queries: Array<
    string | [string] | [string, Record<string, keyof typeof variables>]
  >
) {
  let header = `query Query`
  if (Object.keys(variables).length) {
    header += '('
    header += Object.keys(variables).map(
      (variable) =>
        `${/^\$/.test(variable) ? variable : `$${variable}`}: ${
          variables[variable]
        }`
    )
    header += ')'
  }
  const normalized = queries.map((query) => {
    if (typeof query === 'string') {
      return [query]
    }
    return query
  }) as Array<[string, Record<string, string>]>
  const all = normalized.map(([queryName, queryVariables]) => {
    const op = buildQueryString(schema, queryName).trim().split(/\n/)
    op.shift()
    op.pop()
    return op
      .map((line, index) => {
        if (index === 0 && queryVariables) {
          let nextLine = line
          for (const key in queryVariables) {
            nextLine = nextLine.replace(
              new RegExp(`\\$${key}(\\W)`),
              (/^\$/.test(queryVariables[key])
                ? queryVariables[key]
                : `$${queryVariables[key]}`
              ).concat('$1')
            )
          }
          return `  ${nextLine.trim()}`
        }
        return `  ${line}`
      })
      .join('\n')
  })
  const allJoined = all.join('\n\n')
  const source = `
${header} {
${allJoined}
}
  `
  return gql(source)
}
