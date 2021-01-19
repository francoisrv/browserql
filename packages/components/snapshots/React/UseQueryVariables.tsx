import { makeExecutableQuery } from '@browserql/executable'
import { BrowserqlProvider, UseQuery } from '@browserql/react'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import React from 'react'
import { print } from 'graphql'
import Code from '../../Code'
import TabNav from '../../TabNav'
import TextField from '@material-ui/core/TextField'

export default function UseQueryVariables() {
  const schema = gql`
    type Query {
      getUser(id: ID!): User
    }

    type User {
      id: ID!
      name: String!
    }
  `
  const query = makeExecutableQuery(schema, 'getUser')
  const data = {
    users: [
      {
        id: '1',
        name: 'user1',
      },
      {
        id: '2',
        name: 'user2',
      },
      {
        id: '3',
        name: 'user3',
      },
    ],
  }
  function getUser({ id }: { id: string }) {
    return data.users.find((user) => user.id === id)
  }
  function View(props: { id: string }) {
    const { id } = props
    return (
      <BrowserqlProvider schema={schema} queries={{ getUser }}>
        <UseQuery
          query={query}
          variables={{ id }}
          renderError={(e) => <h5>{e.message}</h5>}
        >
          {({ getUser: user }) => (
            <div>
              {user === null && <p>No user found with id {id}</p>}
              {user !== null && (
                <p>
                  User #{id} is named "{user.name}"
                </p>
              )}
            </div>
          )}
        </UseQuery>
      </BrowserqlProvider>
    )
  }
  return (
    <TabNav
      selected={5}
      tabs={[
        {
          tab: 'Schema',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The GraphQL schema.</Typography>
              <Code language="graphql" value={print(schema)} />
            </div>
          ),
        },
        {
          tab: 'Query',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The GraphQL query.</Typography>
              <Code language="graphql" value={print(query)} />
            </div>
          ),
        },
        {
          tab: 'Data',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The data we'll be querying.</Typography>
              <Code language="json" value={JSON.stringify(data, null, 2)} />
            </div>
          ),
        },
        {
          tab: 'Resolver',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The resolver query we'll use to get user.</Typography>
              <Code
                language="javascript"
                value={`function getUser({ id }) {
  return data.users.find((user) => user.id === id)
}`}
              />
            </div>
          ),
        },
        {
          tab: 'React',
          component: () => (
            <div style={{ padding: 12 }}>
              <Typography>The React view we'll use.</Typography>
              <Code
                language="javascript"
                value={`function View({ id }) {
  return (
    <BrowserqlProvider schema={schema} queries={{ getUser }}>
      <UseQuery
        query={query}
        variables={{ id }}
      >
        {({ getUser: user }) => (
          <div>
            {user === null && <p>No user found with id {id}</p>}
            {user !== null && (
              <p>
                User #{id} is named "{user.name}"
              </p>
            )}
          </div>
        )}
      </UseQuery>
    </BrowserqlProvider>
  )
}`}
              />
            </div>
          ),
        },
        {
          tab: 'Result',
          component: () => {
            const [userId, setUserId] = React.useState('1')
            return (
              <div
                style={{
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <TextField
                    label="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  {!userId && <p>Enter a user id</p>}
                  {userId && <View id={userId} />}
                </div>
              </div>
            )
          },
        },
      ]}
    />
  )
}
