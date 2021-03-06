import Typography from '@material-ui/core/Typography'
import { DocumentNode, print } from 'graphql'
import gql from 'graphql-tag'
import React, { useContext } from 'react'
import makeState from '@browserql/state-react'
import Code from '../Code'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'

function View({ query }: Record<'query', DocumentNode>) {
  const ctx = useContext(BrowserqlContext)
  const State = makeState(ctx.cache, ctx.schema)
  return (
    <>
      <Typography>Schema</Typography>
      <Code language="graphql" value={print(ctx.schema)} />
      <Typography>Query</Typography>
      <Code language="graphql" value={print(query)} />
      <Typography>Cached</Typography>
      <State query={query}>
        {(result) => (
          <>
            <Code language="json" value={JSON.stringify(result, null, 2)} />
          </>
        )}
      </State>
    </>
  )
}

export default function StateExample() {
  const schema = gql`
    type Query {
      getCounter: Int
    }
  `
  const query = gql`
    {
      getCounter
    }
  `
  return (
    <BrowserqlProvider schema={schema}>
      <View query={query} />
    </BrowserqlProvider>
  )
}
