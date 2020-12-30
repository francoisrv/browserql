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

    const { data } = await graphql({
      source,
      schema,
    })
    console.log(0, buildSchema(print(ctx.schema)))
    if (!data) {
      throw new Error('Could not read introspection query')
    }
    return buildClientSchema(data as IntrospectionQuery)
  }

  async function graphQLFetcher(graphQLParams: FetcherParams) {
    if ('query' in graphQLParams) {
      const { query } = graphQLParams
      if (/^query/.test(query)) {
        return await ctx.apollo.query({
          query: gql(query),
        })
      } else if (/^mutation/.test(query)) {
        return await ctx.apollo.mutate({
          mutation: gql(query),
        })
      }
    }
  }

  if (!introspection) {
    setTimeout(async () => {
      const x = await makeSchema()
      console.log({ x })
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
