import * as React from 'react'
import gql from 'graphql-tag'
import {
  BrowserqlContext,
  BrowserqlProvider,
  UseMutation,
  UseQuery,
} from '@browserql/react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '@material-ui/core'
import { BrowserqlContext as BrowserqlClientContext } from '@browserql/types'
import { print } from 'graphql'
import cacheql from '@browserql/cache'
import Code from '../components/Code'
import connect from '@browserql/client'

function ShowSchema() {
  const ctx = React.useContext(BrowserqlContext)
  return <Code language="graphql" value={print(ctx.schema).trim()} />
}

// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //
// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //
// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //

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
    incrementCounter(_variables: null, ctx: BrowserqlClientContext) {
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

// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //
// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //
// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //

export function SchemaExample() {
  const schema = gql`
    type Query {
      isMorning: Boolean
    }
  `
  const client = connect(schema)

  return (
    <BrowserqlProvider client={client}>
      <ShowSchema />
    </BrowserqlProvider>
  )
}

// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //
// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //
// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //

export function SchemaObject() {
  const schema = gql`
    type Query {
      isMorning: Boolean
    }
  `
  const client = connect({ schema })

  return (
    <BrowserqlProvider client={client}>
      <ShowSchema />
    </BrowserqlProvider>
  )
}

// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //
// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //
// /// //// ///// //// /// // // /// //// ///// //// /// // // /// //// ///// //// /// //

export function ResolversExample() {
  const defs = gql`
    type Query {
      isLoggedIn: Boolean
    }

    type Mutation {
      login: Boolean
      logout: Boolean
    }
  `

  const isLoggedIn = (_variables: null, context: BrowserqlClientContext) => {
    return false // default value
  }

  const login = (_variables: null, context: BrowserqlClientContext) => {
    const { cache, schema } = context.browserqlClient
    const cached = cacheql(cache, schema)
    cached.set(
      gql`
        query {
          isLoggedIn
        }
      `,
      true
    )
  }

  const logout = (_variables: null, context: BrowserqlClientContext) => {
    const { cache, schema } = context.browserqlClient
    const cached = cacheql(cache, schema)
    cached.set(
      gql`
        query {
          isLoggedIn
        }
      `,
      false
    )
  }

  const client = connect(defs, {
    queries: { isLoggedIn },
    mutations: { login, logout },
  })

  function Inner() {
    return (
      <UseQuery
        query={gql`
          {
            isLoggedIn
          }
        `}
      >
        {(isLoggedIn) => (
          <UseMutation
            mutation={gql`
              mutation {
                login
                logout
              }
            `}
          >
            {({ login, logout }) => (
              <Button
                fullWidth
                onClick={isLoggedIn ? login : logout}
                color={isLoggedIn ? 'secondary' : 'primary'}
                variant="contained"
              >
                {isLoggedIn ? 'Log out' : 'Log in'}
              </Button>
            )}
          </UseMutation>
        )}
      </UseQuery>
    )
  }

  return (
    <BrowserqlProvider client={client}>
      <Inner />
    </BrowserqlProvider>
  )
}
