import connect from '@browserql/client/dist/connect'
import gql from 'graphql-tag'
import Provider from '@browserql/react-provider'
import useQuery from './useQuery'
import * as React from 'react'
import run, {
  Describe,
  Render,
  Expect,
  Run,
} from 'describe-react'

function App() {
  const getFoo = useQuery<string>('getFoo')
  console.log({getFoo})
  return (
    <div>
      { getFoo }
    </div>
  )
}

function Got() {
  const client = connect({
    schema: gql`
    type Query {
      getFoo: String!
    }
    `
  })
  return (
    <Describe label="Use Query">
      <Render>
        <Provider client={ client }>
          <App />
        </Provider>
      </Render>
      <Expect element="div" toHaveText="" />
      <Run function={ () => client.write('getFoo', 'yeah') } />
      <Expect element="div" toHaveText="yeah" />
    </Describe>
  )
}

run(Got)
