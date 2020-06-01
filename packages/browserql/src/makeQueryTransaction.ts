import { GraphQLField, DocumentNode, TypeNode, isNamedType } from "graphql";
import gql from 'graphql-tag'

function getKind(kind: TypeNode) {
  if (isNamedType(kind)) {

  }
  return ''
}

function resolveKind(query: GraphQLField<any, any>) {
  const { astNode } = query
  if (astNode) {
    const kind = getKind(astNode.type)
  }
  return ''
}

export default function makeQueryTransaction(
  queryName: string,
  query: GraphQLField<any, any>
): DocumentNode {
  if (query.args.length) {
    const node = `
    query ${ queryName }Query(
      ${
        query.args.map(arg => `$${ arg.name }: String`).join('\n  ')
      }
    ) {
      ${ queryName }(
        ${
          query.args.map(arg => `${ arg.name }: $${ arg.name }`).join('\n    ')
        }
      ) ${ resolveKind(query) }
    }
    `
    console.log(node)
    return gql(node)
  } else {
    const node = `
    query {
      ${ queryName } ${ resolveKind(query) }
    }
    `
    console.log(node)
    return gql(node)
  }
}