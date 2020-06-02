import { GraphQLField, TypeNode, isNamedType } from "graphql";
import { TransactionType } from "./types";
import printType from 'browserql-utils/src/printType'

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
    query {
      ${ queryName } ${ resolveKind(query) }
    }
    `
    return node
  }
}