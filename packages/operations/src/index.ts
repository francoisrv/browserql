import type { DocumentNode, InputValueDefinitionNode } from 'graphql'
import {
  getArguments,
  getKind,
  getMutation,
  getName,
  getQuery,
  getType,
  parseKind,
} from '@browserql/fpql'
import { buildFragment } from '@browserql/fragments'
import gql from 'graphql-tag'

export function buildQuery(
  schema: DocumentNode,
  queryName: string
): DocumentNode {
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
      .map((arg) => `$${getName(arg)}: ${getKind(arg)}`)
      .join('\n')})`
    variables = `(${args
      .map((arg) => `${getName(arg)}: $${getName(arg)}`)
      .join('\n')})`
  }
  return gql`
    query ${definitions} {
      ${queryName}${variables} ${selection}
    }
  `
}

export function buildMutation(
  schema: DocumentNode,
  mutationName: string
): DocumentNode {
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
  return gql`
    mutation ${definitions} {
      ${mutationName}${variables} ${selection}
    }
  `
}
