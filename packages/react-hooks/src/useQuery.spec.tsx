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
  Wait,
} from 'describe-react'

function App() {
  const getFoo = useQuery<string>('getFoo')
  return (
    <div>
      { getFoo }
    </div>
  )
}

function App2() {
  const getInt = useQuery<string>('getInt')
  return (
    <div>
      { getInt }
    </div>
  )
}

describe('Use query', () => {
  // run(function () {
  //   const client = connect({
  //     schema: gql`
  //     type Query {
  //       getFoo: String
  //     }
  //     `
  //   })
  
  //   async function updateCache() {
  //     client.write('getFoo', 'yeah')
  //   }
  
  //   return (
  //     <Describe label="With null value">
  //       <Render>
  //         <Provider client={ client }>
  //           <App />
  //         </Provider>
  //       </Render>
  //       <Expect   element="div" toHaveText="" />
  //       <Run      function={ updateCache } label="Update the cache" />
  //       <Expect   element="div" toHaveText="yeah" />
  //     </Describe>
  //   )
  // })

  run(function () {
    const client = connect({
      schema: gql`
      type Query {
        getInt: Int!
      }
      `
    })
  
    async function updateCache() {
      client.write('getInt', 100)
    }

    function readCache() {
      // const query 
    }
  
    return (
      <Describe label="With non-null value">
        <Render>
          <Provider client={ client }>
            <App2 />
          </Provider>
        </Render>
        <Expect   element="div" toHaveText="0" />
      </Describe>
    )
  })
})
