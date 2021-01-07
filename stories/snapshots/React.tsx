import * as React from 'react'
import { gql, useQuery } from '@apollo/client'

import {
  BrowserqlContext,
  BrowserqlProvider,
  BrowserqlProviderProps,
  UseMutation,
  UseQuery,
  withMutation,
  withQuery,
  WithMutationProps,
} from '@browserql/react'
import { buildQuery, buildMutation } from '@browserql/operations'
import connect from '@browserql/client'
import { JSONResolver } from 'graphql-scalars'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeExecutableQuery } from '@browserql/executable'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { print } from 'graphql'
import { renderToStaticMarkup } from 'react-dom/server'

import Code from '../components/Code'
import { find } from 'lodash'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import InputLabel from '@material-ui/core/InputLabel'
import TabNav from '../components/TabNav'

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

const sayHelloExample = {
  schema: gql`
    type Query {
      sayHello(to: String!): String!
    }
  `,
  queries: {
    sayHello({ to }: { to: string }) {
      return `Hello ${to}`
    },
  },
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function ProviderTemplate(props: BrowserqlProviderProps) {
  function SayHello({ to }: { to: string }) {
    const ctx = React.useContext(BrowserqlContext)
    const { data, loading, error } = useQuery(
      buildQuery(ctx.schema, 'sayHello'),
      {
        variables: { to },
      }
    )
    if (error) return <div>{error.message}</div>
    if (loading) return <div>Loading...</div>
    return <p>{data.sayHello}</p>
  }

  return (
    <BrowserqlProvider {...props}>
      <div style={{ padding: 24 }}>
        <SayHello to="everybody" />
      </div>
    </BrowserqlProvider>
  )
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

export function SandboxMainExample() {
  return (
    <ProviderTemplate
      schema={sayHelloExample.schema}
      queries={sayHelloExample.queries}
    />
  )
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

export function ProviderClientProp() {
  const client = connect(sayHelloExample)
  return <ProviderTemplate client={client} />
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

export function ProviderBuildClientProp() {
  return (
    <ProviderTemplate
      schema={gql`
        scalar JSON

        directive @variant(name: VARIANT) on FIELD_DEFINITION

        enum VARIANT {
          HIGH
          LOW
        }

        type Query {
          getHigh: JSON @variant(name: HIGH)
        }

        type Mutation {
          changePitchLevel(level: Float!): JSON!
        }
      `}
      scalars={{ JSON: JSONResolver }}
    />
  )
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

export function QueryExample() {
  const schema = gql`
    type Query {
      sayHello(to: String!): String!
    }
  `

  const queries = {
    sayHello({ to }: { to: string }) {
      return `Hello ${to}`
    },
  }

  const SAY_HELLO = buildQuery(schema, 'sayHello')

  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <div style={{ padding: 24 }}>
        <UseQuery query={SAY_HELLO} variables={{ to: 'everybody' }}>
          {({ sayHello }) => <p>{sayHello}</p>}
        </UseQuery>
      </div>
    </BrowserqlProvider>
  )
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

export function MutationExample() {
  const schema = gql`
    type Mutation {
      sayHello(to: String!): String!
    }
  `

  const mutations = {
    sayHello({ to }: { to: string }) {
      return `Hello ${to}`
    },
  }

  const SAY_HELLO = buildMutation(schema, 'sayHello')

  return (
    <BrowserqlProvider schema={schema} mutations={mutations}>
      <UseMutation mutation={SAY_HELLO}>
        {(response) => <p>{response}</p>}
      </UseMutation>
    </BrowserqlProvider>
  )
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

export function WithQueryExample() {
  const schema = gql`
    type Query {
      sayHello(to: String!): String!
    }
  `
  function SayHello({ sayHello }) {
    if (sayHello.error) return <div>{sayHello.error.message}</div>

    if (sayHello.loading) return <div>Loading...</div>

    return <p>{sayHello.data}</p>
  }
  const Wrapped = withQuery(buildQuery(schema, 'sayHello'), {
    to: 'everybody',
  })(SayHello)
  return (
    <BrowserqlProvider
      schema={schema}
      queries={{
        sayHello({ to }) {
          return `Hello ${to}`
        },
      }}
    >
      <div style={{ padding: 32 }}>
        <Wrapped />
      </div>
    </BrowserqlProvider>
  )
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

export function WithMutationExample() {
  const schema = gql`
    type Query {
      _: ID
    }
    type Mutation {
      multiplyByItself(number: Int!): Int!
    }
  `

  type MutationProps = WithMutationProps<
    'multiplyByItself',
    { multiplyByItself: number },
    { number: number }
  >

  function MultiplyByItself({ multiplyByItself }: MutationProps) {
    const number =
      (multiplyByItself.data && multiplyByItself.data.multiplyByItself) || 2

    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => multiplyByItself.execute({ number })}
            disabled={multiplyByItself.loading}
            color="primary"
            variant="contained"
            size="large"
          >
            {number}
          </Button>
          <Typography style={{ flex: 1, padding: 16 }}>
            Click on the number to multiply it by itself
          </Typography>
        </div>
        {multiplyByItself.error && (
          <Typography style={{ color: '#900' }}>
            {multiplyByItself.error.message}
          </Typography>
        )}
      </>
    )
  }

  const Wrapped = withMutation('multiplyByItself')<
    { multiplyByItself: number },
    { number: number }
  >(buildMutation(schema, 'multiplyByItself'))(MultiplyByItself)

  return (
    <BrowserqlProvider
      schema={schema}
      queries={{
        multiplyByItself({ number }) {
          return number * number
        },
      }}
    >
      <div style={{ padding: 32 }}>
        <Wrapped />
      </div>
    </BrowserqlProvider>
  )
}

export function UseQueryVariables() {
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
              <Typography>The data.</Typography>
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
              <div style={{ padding: 12 }}>
                <TextField
                  label="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                {!userId && <p>Enter a user id</p>}
                {userId && <View id={userId} />}
              </div>
            )
          },
        },
      ]}
    />
  )
}
