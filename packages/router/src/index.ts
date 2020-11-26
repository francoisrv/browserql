import { BrowserqlContext, SchemaqlFactory } from '@browserql/types'
import gql from 'graphql-tag'

export default function connectRouter(): SchemaqlFactory {
  return () => {
    let path = (window.location.hash || '/').replace(/^#/, '')
    const schema = gql`
      extend type Query {
        """
        Used by router to get current path
        """
        getPath(router: String = "MAIN"): String!
      }
      extend type Mutation {
        """
        Used by router to set path
        """
        setPath(router: String = "MAIN", path: String!): Boolean
      }
    `
    const queries = {
      getPath() {
        return path
      },
    }
    const mutations = {
      setPath(
        variables: { path: string; router: string },
        ctx: BrowserqlContext
      ) {
        path = variables.path
        ctx.browserqlClient.cache.writeQuery({
          query: gql`
            query GetPath($router: String!) {
              getPath(router: $router)
            }
          `,
          variables: {
            router: variables.router,
          },
          data: {
            getPath: path,
          },
        })
        return true
      },
    }
    return {
      schema,
      queries,
      mutations,
    }
  }
}
