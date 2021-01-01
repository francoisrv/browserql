import { BrowserqlProvider } from '@browserql/react'
import * as React from 'react'
import { connectHttp } from '@browserql/http'
import gql from 'graphql-tag'
import { buildQuery, buildQueryString } from '@browserql/operations'
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

export function Url() {
  const schema = gql`
    type Query {
      getTodos(protocol: String = "https", completed: Boolean!): [Todo]!
        @http(
          url: ":protocol://jsonplaceholder.typicode.com/todos/?completed=:completed"
        )
    }

    type Todo {
      userId: ID!
      id: ID!
      title: String!
      completed: Boolean!
    }
  `
  const query = buildQuery(schema, 'getTodos')

  console.log(buildQueryString(schema, 'getTodos'))

  function Response() {
    const { data, loading, error } = useQuery(query, {
      variables: {
        completed: true,
      },
    })

    if (error) {
      console.log(error)
      return <div style={{ padding: 24 }}>{error.message}</div>
    }

    if (loading) return <div>Loading...</div>

    return (
      <Code language="json" value={JSON.stringify(data.getTodos, null, 2)} />
    )
  }

  return (
    <BrowserqlProvider schema={schema} extensions={[connectHttp()]}>
      <Response />
    </BrowserqlProvider>
  )
}
