import Code from '@browserql/components/Code'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import React, { useContext } from 'react'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import cacheql from '@browserql/cache'

const schema = `type Query {
  getCounter(user: ID!): Int
}`

const query = gql`
  query Query($user: ID!) {
    getCounter(user: $user)
  }
`

function View() {
  const ctx = useContext(BrowserqlContext)
  const cached = cacheql(ctx.cache, ctx.schema)
  const query1 = useQuery(query, {
    variables: { user: 1 },
  })
  let counter1 = ''
  if (query1.loading) {
    counter1 = 'loading'
  } else if (query1.error) {
    counter1 = 'error'
  } else {
    counter1 = query1.data.getCounter
  }
  return (
    <div>
      <Code language="graphql" value={schema} />
      <div>
        <ButtonGroup fullWidth>
          <Button onClick={() => cached.set(query, { user: 1 }, 10)}>
            User 1
          </Button>
          <Button>User 2</Button>
        </ButtonGroup>
      </div>
      <Code
        language="graphql"
        value={`query {
  getCounter(user: 1): ${counter1}
  getCounter(user: 2): 0
}`}
      />
    </div>
  )
}

export default function Example() {
  return (
    <BrowserqlProvider schema={gql(schema)}>
      <View />
    </BrowserqlProvider>
  )
}

Example.height = 450