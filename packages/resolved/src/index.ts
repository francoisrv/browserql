import { DocumentNode } from 'graphql'
import { buildQuery, buildMutation } from '@browserql/operations'
import { getMutations, getName, getQueries } from '@browserql/fpql'

export type Dictionary<A = any> = {
  [name: string]: A
}

export type Resolved<V extends any = any> = (
  variables: V
) =>
  | {
      query: DocumentNode
      variables: V
    }
  | {
      mutation: DocumentNode
      variables: V
    }

type Resolvers = Dictionary<Resolved>

export default function resolve<
  Q extends Resolvers = Dictionary,
  M extends Resolvers = Dictionary
>(document: DocumentNode) {
  const queries = getQueries(document)
  const mutations = getMutations(document)

  const Query = queries.reduce(
    (Q, query) => ({
      ...Q,
      [getName(query)]: (variables = {}) => ({
        query: buildQuery(document, getName(query)),
        variables,
      }),
    }),
    {}
  )

  const Mutation = mutations.reduce(
    (M, mutation) => ({
      ...M,
      [getName(mutation)]: (variables = {}) => ({
        mutation: buildMutation(document, getName(mutation)),
        variables,
      }),
    }),
    {}
  )

  return {
    Query: Query as Q,
    Mutation: Mutation as M,
  }
}
