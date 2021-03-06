import Typography from '@material-ui/core/Typography'
import { DocumentNode, print } from 'graphql'
import gql from 'graphql-tag'
import React, { useCallback, useContext, useState } from 'react'
import makeState from '@browserql/state-react'
import Code from '../Code'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

function View({ query }: Record<'query', DocumentNode>) {
  const ctx = useContext(BrowserqlContext)
  const State = makeState(ctx.cache, ctx.schema)
  return (
    <>
      <Typography>Schema</Typography>
      <Code language="graphql" value={print(ctx.schema)} />
      <Typography>Query</Typography>
      <Code language="graphql" value={print(query)} />
      <State query={query}>
        {(result, q) => {
          const [set, setSet] = useState('')
          const handleSet = useCallback(() => {
            q(JSON.parse(set))
          }, [set])
          return (
            <>
              <Typography>Cached</Typography>
              <Code
                language="json"
                value={
                  typeof result === 'undefined'
                    ? 'undefined'
                    : JSON.stringify(result, null, 2)
                }
              />
              <Typography>Set</Typography>
              <TextField
                multiline
                value={set}
                onChange={(event) => setSet(event.target.value)}
              />
              <Button onClick={handleSet}>Set</Button>
            </>
          )
        }}
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
