import GraphiQL from '@browserql/graphiql'
import { BrowserqlContext } from '@browserql/react'
import React, { useContext } from 'react'

export default function View() {
  const ctx = useContext(BrowserqlContext)
  const defaultQuery = '{ sayHello(to: "everybody") }'
  const response = JSON.stringify(
    {
      data: {
        sayHello: 'hello everybdoy',
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
    null,
    2
  )
  return (
    <GraphiQL
      graphiqlProps={{
        defaultQuery,
        query: defaultQuery,
        defaultSecondaryEditorOpen: true,
        headerEditorEnabled: true,
        response,
      }}
      client={ctx.apollo}
      schema={ctx.schema}
    />
  )
}
