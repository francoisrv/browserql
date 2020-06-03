import { GraphQLField } from 'graphql'

import { printType } from '@browserql/utils'

import { TransactionType } from './types'

function resolveKind(query: GraphQLField<any, any>) {
  const { astNode } = query
  if (astNode) {
  }
  return ''
}

export default function makeTransaction(
  type: TransactionType,
  queryName: string,
  query: GraphQLField<any, any>
): string {
  if (query.args.length) {
    const node = `
    ${ type } ${ queryName }(
      ${
        query.args.map(arg => `$${ arg.name }: ${ printType(query.type) }`).join('\n  ')
      }
    ) {
      ${ queryName }(
        ${
          query.args.map(arg => `${ arg.name }: $${ arg.name }`).join('\n    ')
        }
      ) ${ resolveKind(query) }
    }
    `
    return node
  } else {
    const node = `
    ${ type } {
      ${ queryName } ${ resolveKind(query) }
    }
    `
    return node
  }
}
