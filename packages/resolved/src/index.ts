import { DocumentNode } from 'graphql'
import makeContracts from '@browserql/contracts'

export default function resolve<Q = any, M = any>(
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
