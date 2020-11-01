import React from 'react'
import ReactDOM from 'react-dom'
import gql from 'graphql-tag'
import GraphiQL from '../../browserql/packages/graphiql'
import { BrowserqlProvider } from '../../browserql/packages/react'

// @ts-ignore
ReactDOM.render(
  <div>
    <BrowserqlProvider
      schema={gql`
        extend type Query {
          foo: OD
          bar: ID
        }
      `}
    >
      <GraphiQL />
    </BrowserqlProvider>
  </div>,
  document.getElementById('root')
)
