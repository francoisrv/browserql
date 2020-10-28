import type { DocumentNode, FieldDefinitionNode } from 'graphql'
import type { Dictionary } from 'lodash'
import makeFragments from '@browserql/fragments'
import gql from 'graphql-tag'
import {
  getArguments,
  getKind,
  getMutations,
  getName,
  getQueries,
  getType,
  parseKind,
} from '@browserql/fpql'

export default function makeContracts(document: string | DocumentNode) {
  const schema = typeof document === 'string' ? gql(document) : document
  const fragments = makeFragments(document)
  const queries = getQueries(schema)
  const mutations = getMutations(schema)
  const Query: Dictionary<DocumentNode> = {}
  const Mutation: Dictionary<DocumentNode> = {}

  const make = (
    operation: 'query' | 'mutation',
    field: FieldDefinitionNode
  ) => {
    const name = getName(field)
    const args = getArguments(field)
    const { type } = parseKind(getKind(field))
    const matchingType = getType(type)(schema)
    const parts: string[] = []

    const headers: string[] = [operation]
    if (args.length) {
      headers.push(
        operation === 'query' ? `${name}Query(\n` : `${name}Mutation(\n`
      )
      headers.push(
        // @ts-ignore
        args.map((arg) => ` $${getName(arg)}: ${getKind(arg)}`).join('\n ')
      )
      headers.push('\n)')
    }
    headers.push('{')
    parts.push(headers.join(' '))

    const subHeaders: string[] = [' ', name]
    if (args.length) {
      subHeaders.push('(\n   ')
      subHeaders.push(
        // @ts-ignore
        args.map((arg) => `${getName(arg)}: $${getName(arg)}`).join('\n    ')
      )
      subHeaders.push('\n  )')
    }

    if (matchingType) {
      subHeaders.push('{')
    }

    parts.push(subHeaders.join(' '))

    if (matchingType) {
      parts.push(`     ...${type}Fragment`)
      parts.push('  }')
    }

    parts.push('}')

    parts.push(fragments.get(type) || '')

    const results = gql(parts.join('\n')) as DocumentNode

    if (operation === 'query') {
      Query[name] = results
    } else {
      Mutation[name] = results
    }
  }

  queries.forEach((query) => {
    make('query', query)
  })

  mutations.forEach((mutation) => {
    make('mutation', mutation)
  })

  return {
    Query,
    Mutation,
  }
}
