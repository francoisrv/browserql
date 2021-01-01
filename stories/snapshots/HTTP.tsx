import { BrowserqlProvider } from '@browserql/react'
import * as React from 'react'
import { connectHttp } from '@browserql/http'
import gql from 'graphql-tag'
import { buildQuery } from '@browserql/operations'
import { useQuery } from '@apollo/client'
import { JSONResolver } from 'graphql-scalars'
import Code from '../components/Code'

export function Example() {
  const schema = gql`
    type Query {
      getTodo(id: ID!): Todo
        @http(url: "https://jsonplaceholder.typicode.com/todos/:id")
    }

    type Todo {
      userId: ID!
      id: ID!
      title: String!
      completed: Boolean!
    }
  `
  const query = buildQuery(schema, 'getTodo')

  function Response() {
    const { data, loading, error } = useQuery(query, {
      variables: {
        id: 2,
      },
    })

    if (error) return <div>{error.message}</div>

    if (loading) return <div>Loading...</div>

    return <Code language="json" value={JSON.stringify(data, null, 2)} />
  }

  return (
    <BrowserqlProvider
      schema={schema}
      extensions={[connectHttp()]}
      scalars={{
        JSON: JSONResolver,
      }}
    >
      <Response />
    </BrowserqlProvider>
  )
}

export function Post() {
  const schema = gql`
    type Query {
      addTodo(title: String!, completed: Boolean = false): Todo
        @httpFalse(
          url: "https://jsonplaceholder.typicode.com/todos/:id"
          query: false
        )
    }

    type Todo {
      userId: ID!
      id: ID!
      title: String!
      completed: Boolean!
    }
  `
  const query = buildQuery(schema, 'getTodo')

  function Response() {
    const { data, loading, error } = useQuery(query, {
      variables: {
        id: 2,
      },
    })

    if (error) return <div>{error.message}</div>

    if (loading) return <div>Loading...</div>

    return (
      <Code language="json" value={JSON.stringify(data.getTodo, null, 2)} />
    )
  }

  return (
    <BrowserqlProvider
      schema={schema}
      extensions={[connectHttp()]}
      scalars={{
        JSON: JSONResolver,
      }}
    >
      <Response />
    </BrowserqlProvider>
  )
}
