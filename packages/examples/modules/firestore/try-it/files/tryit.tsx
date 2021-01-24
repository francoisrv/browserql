import React from 'react'
import gql from 'graphql-tag'
import { BrowserqlProvider } from '@browserql/react'
import { JSONResolver } from 'graphql-scalars'
import { connect as connectFirestoreql } from '@browserql/firestore'
import GraphiQL from '@browserql/graphiql'
import MockFirebase from 'mock-cloud-firestore'

export default function TryIt() {
  const fixtureData = {
    __collection__: {
      users: {
        __doc__: {
          user_a: {
            age: 15,
            username: 'user_a',
          },
        },
      },
      Todo: {
        __doc__: {
          todo_1: {
            done: false,
            title: 'Buy milk',
          },
        },
      },
    },
  }

  const firebase = new MockFirebase(fixtureData)

  const schema = gql`
    type Todo @firestore {
      title: String!
      done: Boolean!
    }
  `
  return (
    <BrowserqlProvider
      schema={schema}
      scalars={{ JSON: JSONResolver }}
      extensions={[
        connectFirestoreql(firebase.firestore(), schema),
        {
          schema: gql`
            scalar JSON
          `,
        },
      ]}
    >
      <div style={{ height: 600 }}>
        <GraphiQL
          graphiqlProps={{
            query: `query GetManyTodo(
  $where: [FirestoreWhere]
  $filters: FirestoreFilters
) {
  firestore_getMany_Todo(
    where: $where
    filters: $filters
  ) {
    id
    title
    done
  }
}
`,
            response: JSON.stringify(
              {
                data: {
                  firestore_getMany_Todo: [
                    {
                      id: 'todo_1',
                      title: 'Buy milk',
                      done: false,
                      __typename: 'Todo',
                    },
                  ],
                },
                loading: false,
                networkStatus: 7,
                stale: false,
              },
              null,
              2
            ),
            variables: JSON.stringify({}, null, 2),
          }}
        />
      </div>
    </BrowserqlProvider>
  )
}

TryIt.height = 900
