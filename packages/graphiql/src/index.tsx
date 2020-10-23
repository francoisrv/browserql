import { BrowserqlContext } from '@browserql/react'
import type { BrowserqlClient } from '@browserql/types'
import enhanceSchema from '@browserql/schema'
import NativeGraphiQL from 'graphiql'
import { FetcherParams } from 'graphiql/dist/components/GraphiQL'
import {
  getIntrospectionQuery,
  buildClientSchema,
  graphql,
  buildSchema,
  print,
} from 'graphql'
import gql from 'graphql-tag'

import 'graphiql/graphiql.min.css'
import React, { useState } from 'react'

export default function GraphiQL() {
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
    return buildClientSchema(data)
  }

  async function graphQLFetcher(graphQLParams: FetcherParams) {
    return await ctx.apollo.query({
      query: gql(query),
    })
  }

  if (!introspection) {
    setTimeout(async () => {
      const x = await makeSchema()
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
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close' : 'Open'} GraphiQL
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            zIndex: 9998,
            bottom: 20,
            right: 20,
            left: 20,
            top: 20,
            // border: '5px solid black',
            // borderRadius: 12,
            boxShadow: '0 0 5px 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          <NativeGraphiQL fetcher={graphQLFetcher} schema={introspection} />
        </div>
      )}
    </>
  )
}
