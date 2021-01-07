import { makeExecutableQuery } from '@browserql/executable'
import { BrowserqlProvider, UseQuery } from '@browserql/react'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import React from 'react'
import { print } from 'graphql'
import Code from '../../components/Code'
import TabNav from '../../components/TabNav'
import TextField from '@material-ui/core/TextField'

export default function UseQueryLoading() {
  const schema = gql`
    type Query {
      wait(seconds: Int!): Boolean
    }
  `
  const query = makeExecutableQuery(schema, 'wait')
  async function wait({ seconds }: { seconds: number }) {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
    return true
  }
  function View(props: { seconds: number }) {
    const { seconds } = props
    return (
      <BrowserqlProvider schema={schema} queries={{ wait }}>
        <UseQuery
          query={query}
          variables={{ seconds }}
          renderError={(e) => <h5>{e.message}</h5>}
          renderLoading={<Typography>Waiting {seconds} seconds...</Typography>}
        >
          {() => <p>Wait is over!</p>}
        </UseQuery>
      </BrowserqlProvider>
    )
  }
  return (
    <TabNav
      selected={4}
      tabs={[
        {
          tab: 'Schema',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The GraphQL schema.</Typography>
              <Code language="graphql" value={print(schema)} />
            </div>
          ),
        },
        {
          tab: 'Query',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The GraphQL query.</Typography>
              <Code language="graphql" value={print(query)} />
            </div>
          ),
        },
        {
          tab: 'Resolver',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The resolver query we'll use to get user.</Typography>
              <Code
                language="javascript"
                value={`async function wait({ seconds }) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  return true
}`}
              />
            </div>
          ),
        },
        {
          tab: 'React',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The React view we'll use.</Typography>
              <Code
                language="javascript"
                value={`function View({ seconds }) {
  return (
    <BrowserqlProvider schema={schema} queries={{ wait }}>
      <UseQuery
        query={query}
        variables={{ seconds }}
        renderLoading={<div>Waiting {seconds} seconds...</div>}
      >
        {() => <p>Wait is over!</p>}
      </UseQuery>
    </BrowserqlProvider>
  )
}`}
              />
            </div>
          ),
        },
        {
          tab: 'Result',
          component: () => {
            const [seconds, setSeconds] = React.useState(5)
            return (
              <div
                style={{
                  padding: 24,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <TextField
                    type="number"
                    label="Seconds to wait"
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                  />
                  {!seconds && <p>Enter a user id</p>}
                  {seconds && <View seconds={seconds} />}
                </div>
              </div>
            )
          },
        },
      ]}
    />
  )
}
