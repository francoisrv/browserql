import { DocumentNode } from 'graphql'
import makeContracts from '@browserql/contracts'
import { BrowserqlClient } from '@browserql/client'

type Dictionary<A = any> = {
  [name: string]: A
}

type Resolver<
  V extends Dictionary = {},
  D = any
> = (
  variables: V,
  context: BrowserqlClient['context']
) => {
  query: DocumentNode
  variables: V
} | {
  mutation: DocumentNode
  variables: V
}

type Resolvers = Dictionary<Resolver>

export default function resolve<
  Q extends Resolvers = {},
  M extends Resolvers = {}
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
