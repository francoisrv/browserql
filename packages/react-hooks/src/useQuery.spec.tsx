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
  return (
    <div>
      { getFoo }
    </div>
  )
}

run(function () {
  const client = connect({
    schema: gql`
    type Query {
      getFoo: String
    }
    `
  })

  async function updateCache() {
    client.write('getFoo', 'yeah')
  }

  return (
    <Describe label="Use Query">
      <Render>
        <Provider client={ client }>
          <App />
        </Provider>
      </Render>
      <Expect   element="div" toHaveText="" />
      <Run      function={ updateCache } label="Update the cache" />
      <Expect   element="div" toHaveText="yeah" />
    </Describe>
  )
})
