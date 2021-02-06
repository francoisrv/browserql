import React, { useContext } from 'react'
import gql from 'graphql-tag'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'
import { JSONResolver } from 'graphql-scalars'
import { connect as connectFirestoreql } from '@browserql/firestore'
import GraphiQL from '@browserql/graphiql'
import MockFirebase from 'mock-cloud-firestore'
import mockDb from '../mockDb'

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

  const db = mockDb([
    {
      collection: 'Todo',
      id: 'todo_1',
      data: {
        done: false,
        title: 'Buy milk',
      },
    },
  ])

  const schema = gql`
    type Todo @firestore {
      title: String!
      done: Boolean!
    }
  `

  function View() {
    const ctx = useContext(BrowserqlContext)
    return (
      <GraphiQL
        schema={ctx.schema}
        client={ctx.client}
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
    )
  }

  return (
    <BrowserqlProvider
      schema={schema}
      scalars={{ JSON: JSONResolver }}
      extensions={[
        connectFirestoreql(db, schema),
        {
          schema: gql`
            scalar JSON
          `,
        },
      ]}
    >
      <div style={{ height: 600 }}>
        <View />
      </div>
    </BrowserqlProvider>
  )
}

TryIt.height = 900
