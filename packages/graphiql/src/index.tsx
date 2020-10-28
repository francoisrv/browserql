import { BrowserqlContext } from '@browserql/react'
import enhanceSchema from '@browserql/schema'
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
} from 'graphql'
import gql from 'graphql-tag'
import { ErrorBoundary } from 'react-error-boundary'

import 'graphiql/graphiql.min.css'
import React, { CSSProperties, useState } from 'react'

interface Props {
  buttonStyle?: CSSProperties
  rootStyle?: CSSProperties
  graphiqlProps?: GraphiQLProps
}

export default function GraphiQL(props: Props) {
  const { buttonStyle, rootStyle, graphiqlProps } = props
  const ctx = React.useContext(BrowserqlContext)
  const schema = enhanceSchema(ctx.schema as string)
  const [open, setOpen] = useState(false)
  const [introspection, setIntrospection] = useState()

  async function makeSchema() {
    const source = getIntrospectionQuery()
    const { data } = await graphql({
      source,
      // @ts-ignore
      schema: buildSchema(print(ctx.schema)),
    })
    // @ts-ignore
    return buildClientSchema(data)
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
      // @ts-ignore
      setIntrospection(x)
    })
    return <div />
  }

  return (
    <>
      <button
        style={{
          position: 'fixed',
          zIndex: 9999,
          bottom: 20,
          right: 20,
          ...buttonStyle,
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close' : 'Open'} GraphiQL
      </button>
      <div
        style={{
          position: 'fixed',
          zIndex: 9998,
          height: 'calc(100vh - 40px)',
          right: 20,
          left: 20,
          top: open ? 20 : '-100vh',
          transition: 'all 0.35s ease-out',
          boxShadow: '0 0 5px 5px rgba(0, 0, 0, 0.3)',
          opacity: 0.95,
          ...rootStyle,
        }}
      >
        <ErrorBoundary
          FallbackComponent={({ error }) => {
            return (
              <div>
                <h1>Error: {error?.message}</h1>
                <pre>{error?.stack}</pre>
                <pre>{JSON.stringify(introspection, null, 2)}</pre>
              </div>
            )
          }}
        >
          <NativeGraphiQL
            // @ts-ignore
            fetcher={graphQLFetcher}
            schema={introspection}
            {...graphiqlProps}
          />
        </ErrorBoundary>
      </div>
    </>
  )
}
