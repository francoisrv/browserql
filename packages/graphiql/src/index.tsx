import React from 'react'
import GraphiQL from 'graphiql'
import { Context } from '@browserql/react-provider'
import gql from 'graphql-tag'

export default function BrowserQLGraphiQL() {
  const [shown, setShown] = React.useState(false)
  const toggle = () => setShown(!shown)
  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 16,
    zIndex: 12001
  }
  const client = React.useContext(Context)
  async function graphQLFetcher(graphQLParams: any): Promise<{ data: any }> {
    const query = gql(graphQLParams.query)
    if (query.definitions[0]) {
      if (query.definitions[0].operation === 'query') {
        return await client?.apollo.query({ query, variables: graphQLParams.variables })   
      }
      if (query.definitions[0].operation === 'mutation') {
        return await client?.apollo.mutate({ mutation: query, variables: graphQLParams.variables })   
      }
    }
  }
  return (
    <div>
      { shown && (
        <div
        style={{
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 12000
        }}
      >
        <GraphiQL
          fetcher={ graphQLFetcher }
          editorTheme="monokai dark"
          schema={ client?.getSchema().toAST() }
          defaultQuery="# browserql"
        />
        </div>
      ) }
      <button onClick={ toggle } style={ style }>
        Graph<em>i</em>QL
      </button>
    </div>
  )
}
