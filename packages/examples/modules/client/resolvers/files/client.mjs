import gql from 'graphql-tag'
import cacheql from '@browserql/cache'
import IS_LOGGED_IN from './IS_LOGGED_IN.graphql'

// Our query resolver
const isLoggedIn = () => false // default value

// Our mutation resolvers
const login = (_variables, context) => {
  const { cache, schema } = context.browserqlClient
  cacheql(cache, schema).set(IS_LOGGED_IN, true)
}
const logout = (_variables, context) => {
  const { cache, schema } = context.browserqlClient
  cacheql(cache, schema).set(IS_LOGGED_IN, false)
}

// Now we connect everything
const { client } = connect({
  schema: defs,
  queries: { isLoggedIn },
  mutations: { login, logout },
})

export default client
