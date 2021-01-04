import { BrowserqlContext } from '@browserql/react'
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
} from 'graphql'
import gql from 'graphql-tag'
import 'graphiql/graphiql.min.css'
import React, { useState } from 'react'
import {
  getExecutableOperation,
  getExecutableOperations,
} from '@browserql/fpql'

interface Props {
  graphiqlProps?: Partial<GraphiQLProps>
}

export default function GraphiQL(props: Props) {
  const { graphiqlProps } = props
  const ctx = React.useContext(BrowserqlContext)
  const [introspection, setIntrospection] = useState()

  async function makeSchema() {
    const source = getIntrospectionQuery()

    const schema = buildSchema(print(ctx.schema))

    const response = await graphql({
      source,
      schema,
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
    console.log({ graphQLParams })
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
        return await ctx.apollo.query({
          query: op,
          variables,
        })
      } else if (operation.operation === 'mutation') {
        return await ctx.apollo.mutate({
          mutation: op,
          variables,
        })
      }
    }
    throw new Error('Could no execute operation')
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
