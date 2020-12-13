import * as React from 'react'
import gql from 'graphql-tag'
import { BrowserqlProvider } from '@browserql/react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '@material-ui/core'
import { BrowserqlContext } from '@browserql/types'

export function Counter() {
  const schema = gql`
    extend type Query {
      getCounter: Int!
    }

    extend type Mutation {
      incrementCounter: Boolean!
    }
  `

  const queries = {
    getCounter() {
      return 0
    },
  }

  const mutations = {
    incrementCounter(_variables: null, ctx: BrowserqlContext) {
      const { cache } = ctx.browserqlClient
      try {
        const response = cache.readQuery<{ getCounter: number }>({
          query,
        })
        if (response) {
          cache.writeQuery({
            query,
            data: {
              getCounter: response.getCounter + 1,
            },
          })
          return true
        }
        return false
      } catch (error) {
        return false
      }
    },
  }

  const query = gql`
    query {
      getCounter
    }
  `

  const mutation = gql`
    mutation {
      incrementCounter
    }
  `

  function CounterView() {
    const { data, loading } = useQuery(query)
    const [incrementCounter] = useMutation(mutation)
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => incrementCounter()}
      >
        {loading && '...'}
        {!loading && `${data.getCounter} clicks`}
      </Button>
    )
  }

  return (
    <BrowserqlProvider schema={schema} queries={queries} mutations={mutations}>
      <CounterView />
    </BrowserqlProvider>
  )
}