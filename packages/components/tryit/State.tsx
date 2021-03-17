import Typography from '@material-ui/core/Typography'
import { DocumentNode, print } from 'graphql'
import gql from 'graphql-tag'
import React, { useCallback, useContext, useState } from 'react'
import makeState from '@browserql/state-react'
import Code from '../Code'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

function View({
  query,
  variables,
}: Record<'query', DocumentNode> & {
  variables?: Record<string, string>
}) {
  const ctx = useContext(BrowserqlContext)
  const State = makeState(ctx.cache, ctx.schema)
  return (
    <>
      <Typography variant="h5">Schema</Typography>
      <Code language="graphql" value={print(ctx.schema)} />
      <Typography variant="h5">Query</Typography>
      <Code language="graphql" value={print(query)} />
      {variables && (
        <>
          <Typography variant="h5">Variables</Typography>
          <Code language="json" value={JSON.stringify(variables, null, 2)} />
        </>
      )}
      <State query={query}>
        {(result, q) => {
          const [set, setSet] = useState('')
          const handleSet = useCallback(() => {
            q(JSON.parse(set))
          }, [set])
          return (
            <>
              <Typography variant="h5">Cached</Typography>
              {console.log({ result })}
              <Code language="json" value={JSON.stringify(result, null, 2)} />
              <Typography variant="h5">Set</Typography>
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

export default function StateExample({
  schema,
  query,
  variables,
}: Record<'schema' | 'query', DocumentNode> & {
  variables?: Record<string, string>
}) {
  return (
    <BrowserqlProvider schema={schema}>
      <View query={query} variables={variables} />
    </BrowserqlProvider>
  )
}
