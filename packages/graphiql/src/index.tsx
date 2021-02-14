import NativeGraphiQL from 'graphiql'
import type {
  FetcherParams,
  GraphiQLProps,
} from 'graphiql/dist/components/GraphiQL'
import {
  getIntrospectionQuery,
  buildClientSchema,
  graphql,
  buildSchema,
  print,
  IntrospectionQuery,
  DocumentNode,
} from 'graphql'
import gql from 'graphql-tag'
import 'graphiql/graphiql.min.css'
import React, { useState } from 'react'
import {
  getExecutableOperation,
  getExecutableOperations,
} from '@browserql/fpql'
import { ApolloClient } from '@apollo/client'

interface Props {
  schema: DocumentNode
  client: ApolloClient<any>
  graphiqlProps?: Partial<GraphiQLProps>
}

export default function GraphiQL({ client, graphiqlProps, schema }: Props) {
  const [introspection, setIntrospection] = useState()

  async function makeSchema() {
    const source = getIntrospectionQuery()

    const builtSchema = buildSchema(print(schema))

    const response = await graphql({
      source,
      schema: builtSchema,
    })
    if (response.errors) {
      throw new Error(response.errors.join('\n'))
    }
    const { data } = response
    if (!data) {
      throw new Error('Could not read introspection query')
    }
    return buildClientSchema(data as IntrospectionQuery)
  }

  async function graphQLFetcher(graphQLParams: FetcherParams) {
    if ('query' in graphQLParams) {
      const { query, operationName, variables } = graphQLParams
      const node = gql(query)
      const operations = getExecutableOperations(node)
      if (operations.length > 2 && !operationName) {
        throw new Error(
          `${operations.length} operations passed but no operation name to specify which one to execute`
        )
      }
      const operation =
        operations.length === 1
          ? operations[0]
          : getExecutableOperation(operationName)(node)
      if (!operation) {
        throw new Error('No suitable operation found')
      }
      const source = print(operation)
      const op = gql(source)
      if (operation.operation === 'query') {
        return await client.query({
          query: op,
          variables,
        })
      } else if (operation.operation === 'mutation') {
        return await client.mutate({
          mutation: op,
          variables,
        })
      } else if (operation.operation === 'subscription') {
      }
    }
    throw new Error('Could not execute operation')
  }

  if (!introspection) {
    setTimeout(async () => {
      const x = await makeSchema()
      // @ts-ignore
      setIntrospection(x)
    })
    return <div />
  }

  return (
    <NativeGraphiQL
      // @ts-ignore
      fetcher={graphQLFetcher}
      schema={introspection}
      {...graphiqlProps}
    />
  )
}
