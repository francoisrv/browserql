import * as React from 'react'
import gql from 'graphql-tag'
import { build, showCollections, get } from '@browserql/firestore'
import { print, ASTNode, DocumentNode } from 'graphql'
import MockFirebase from 'mock-cloud-firestore'
import connect from '@browserql/client'
import { connect as connectFirestoreql } from '@browserql/firestore'
import { JSONResolver } from 'graphql-scalars'

import Code from '../components/Code'
import { firestore } from '../utils'
import { getQuery, merge } from '@browserql/fpql'
import { BrowserqlProvider, UseQuery } from '@browserql/react'
import Typography from '@material-ui/core/Typography'
import GraphiQL from '@browserql/graphiql'

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

function TemplateRunQuery({ schema }: { schema: DocumentNode }) {
  console.log({ schema })
  const { client } = connect(connectFirestoreql(firebase, schema))
  return <div>LIFGE AGAIN</div>
}

export function ShowCollections() {
  const schema = gql`
    type A @firestore {
      name: String!
    }

    type B @firestore(collection: "collection-b") {
      name: String!
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(showCollections(schema), null, 2)}
    />
  )
}

export function GetOne() {
  const { schema } = build(
    firestore,
    gql`
      type MyCollection @firestore {
        name: String!
      }
    `
  )
  const query = getQuery('firestore_getOne_MyCollection')(
    schema as DocumentNode
  )
  return (
    <Code
      language="graphql"
      value={`
  extend type Query {
    ${print(query as ASTNode)}
  }
  `}
    />
  )
}

export function GetMany() {
  const { schema } = build(
    firestore,
    gql`
      type MyCollection @firestore {
        name: String!
      }
    `
  )
  const query = getQuery('firestore_getMany_MyCollection')(
    schema as DocumentNode
  )
  return (
    <Code
      language="graphql"
      value={`
  extend type Query {
    ${print(query as ASTNode)}
  }
  `}
    />
  )
}

export function Count() {
  const defs = gql`
    type MyCollection @firestore {
      name: String!
    }
  `

  const { schema } = build(firestore, defs)
  const query = getQuery('firestore_count_MyCollection')(schema as DocumentNode)
  return (
    <>
      <Code language="graphql" value={print(defs).trim()} />
      <Code
        language="graphql"
        value={`
type Query {
  ${print(query as ASTNode)}
}
`.trim()}
      />
      <Code
        language="javascript"
        value={`await client.query(count(defs, 'MyCollection'))`}
      />
      <TemplateRunQuery schema={merge(defs, schema)} />
    </>
  )
}

export function Pluralize() {
  const schema = gql`
    type User @firestore {
      name: String!
    }

    type Team @firestore {
      name: String!
    }
  `

  const pluralize = (name: string) => name.toLowerCase().concat('s')
  return (
    <Code
      language="json"
      value={JSON.stringify(
        showCollections(schema, {
          namingStrategy: pluralize,
        }),
        null,
        2
      )}
    />
  )
}

export function GeneratedSchema() {
  const { schema } = build(
    firestore,
    gql`
      type Foo {
        name: String!
      }
    `
  )
  return <Code language="graphql" value={print(schema as DocumentNode)} />
}

export function Example1() {
  const schema = gql`
    type Todo @firestore {
      name: String!
      done: Boolean! @default(value: false)
      doneTime: FirestoreTimestamp
    }
  `

  return <div>hello</div>
}

export function ApiGet() {
  const schema = gql`
    type Todo @firestore {
      id: ID!
      title: String!
      done: Boolean!
    }
  `

  const client = connect(
    schema,
    connectFirestoreql(firebase.firestore(), schema),
    {
      schema: gql('scalar JSON'),
    },
    {
      scalars: {
        JSON: JSONResolver,
      },
    }
  )
  console.log(client.schema.loc?.source.body)

  function View() {
    return (
      <UseQuery
        query={get(client.schema, 'Todo')}
        renderError={(error) => {
          return <div>{error.message}</div>
        }}
      >
        {(todos) => (
          <Code language="json" value={JSON.stringify(todos, null, 2)} />
        )}
      </UseQuery>
    )
  }

  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <Typography variant="h5">Query</Typography>
      <Code language="graphql" value={print(get(client.schema, 'Todo'))} />

      <Typography variant="h5">Variables</Typography>
      <Code language="json" value={JSON.stringify({}, null, 2)} />

      <Typography variant="h5">Results</Typography>
      <BrowserqlProvider client={client}>
        <View />
      </BrowserqlProvider>
    </div>
  )
}

export function TryIt() {
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
