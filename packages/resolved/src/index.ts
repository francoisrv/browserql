import { DocumentNode } from 'graphql'
import makeContracts from '@browserql/contracts'

export type Dictionary<A = any> = {
  [name: string]: A
}

export type Resolved<
  V extends any = any
> = (
  variables: V,
) => {
  query: DocumentNode
  variables: V
} | {
  mutation: DocumentNode
  variables: V
}

type Resolvers = Dictionary<Resolved>

export default function resolve<
  Q extends Resolvers = Dictionary,
  M extends Resolvers = Dictionary
>(
  document: string | DocumentNode
) {
  const contracts = makeContracts(document)
  const Query: any = {}
  const Mutation: any = {}

  for (const query in contracts.Query) {
    Query[query] = (variables = {}) => ({
      query: contracts.Query[query],
      variables,
    })
  }

  for (const mutation in contracts.Mutation) {
    Mutation[mutation] = (variables = {}) => ({
      mutation: contracts.Mutation[mutation],
      variables,
    })
  }

  return {
    Query: Query as Q,
    Mutation: Mutation as M,
  }
}
