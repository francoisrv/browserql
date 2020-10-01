import { DocumentNode, print } from 'graphql'
import makeContracts from '@browserql/contracts'

type Operation<T> = {
  [name in keyof T]: (
    variables: any
  ) =>
    | {
        query: DocumentNode
        variables: any
      }
    | {
        mutation: DocumentNode
        variables: any
      }
}

export default function resolve(document: string | DocumentNode) {
  const contracts = makeContracts(document)
  const Query: Partial<Operation<typeof contracts>> = {}
  const Mutation: Partial<Operation<typeof contracts>> = {}
  for (const query in contracts.Query) {
    console.log(print(contracts.Query[query]))
    Query[query as keyof typeof contracts] = (variables = {}) => ({
      query: contracts.Query[query],
      variables,
    })
  }
  for (const mutation in contracts.Mutation) {
    Mutation[mutation as keyof typeof contracts] = (variables = {}) => ({
      mutation: contracts.Mutation[mutation],
      variables,
    })
  }
  return {
    Query,
    Mutation,
  }
}
