import { makeExecutableQuery } from '@browserql/executable'
import { BrowserqlProvider, UseQuery } from '@browserql/react'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import React from 'react'
import { print } from 'graphql'
import Code from '../../Code'
import TabNav from '../../TabNav'
import TextField from '@material-ui/core/TextField'

export default function UseQueryError() {
  const schema = gql`
    type Query {
      foo: Boolean!
    }
  `
  const query = makeExecutableQuery(schema, 'foo')
  async function foo() {
    throw new Error('Throwing a lambda error to test error renderer')
  }
  function View(props: { seconds: number }) {
    const { seconds } = props
    return (
      <BrowserqlProvider schema={schema} queries={{ foo }}>
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
      selected={1}
      tabs={[
        {
          tab: 'React',
          component: () => (
            <div style={{ padding: 12 }}>
              <Code
                language="javascript"
                value={`function View() {
  return (
    <BrowserqlProvider schema={schema} queries={{ wait }}>
      <UseQuery
        query={query}
        variables={{ seconds }}
        renderError={(e) => <h5>{e.message}</h5>}
      >
        {() => <div />}
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
                <View seconds={seconds} />
              </div>
            )
          },
        },
      ]}
    />
  )
}
