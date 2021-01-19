import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import * as React from 'react'
import Code from '../Code'
import gql from 'graphql-tag'
import { print } from 'graphql'
import { BrowserqlProvider } from '@browserql/react'
import { JSONResolver } from 'graphql-scalars'
import { connect as connectFirestoreql } from '@browserql/firestore'
import MockFirebase from 'mock-cloud-firestore'
import { Firestoreql } from '@browserql/firestore-react'
import { omit, range } from 'lodash'
import { Chance } from 'chance'

const chance = new Chance()

function makeSource(collection: string, action: string) {
  return `function View() {
  return (
    <Firestorel ${action}="${collection}" limit={50}>
      {todos => <div>{JSON.stringify(todos)}</div>}
    </firestoreql>
  )
}`
}

function getQueryName(collection: string, action: string) {
  return `firestore_${action}Many_${collection}`
}

export function TryIt() {
  const [collection, setCollection] = React.useState('Todo')
  const [action, setAction] = React.useState('get')
  const [source, setSource] = React.useState<string>(
    makeSource(collection, action)
  )

  const schema = gql`
    type Todo @firestore {
      title: String!
      done: Boolean! @default(value: false)
    }
  `

  const todos = range(1000).map((id) => ({
    id,
    title: `${chance.word({ syllables: 3 })} ${chance.word({ syllables: 3 })}`,
    boolean: chance.bool(),
  }))

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
        __doc__: todos.reduce(
          (docs, todo) => ({
            ...docs,
            [todo.id]: omit(todo, ['id']),
          }),
          {}
        ),
      },
    },
  }

  const firebase = new MockFirebase(fixtureData)

  React.useEffect(() => {
    setSource(makeSource(collection, action))
  }, [collection, action])

  return (
    <BrowserqlProvider
      schema={schema}
      scalars={{ JSON: JSONResolver }}
      extensions={[
        connectFirestoreql(firebase.firestore(), schema),
        {
          schema: gql`
            scalar JSON
            directive @default(value: JSON!) on FIELD_DEFINITION
          `,
        },
      ]}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ padding: 16, width: 400 }}>
          <FormControl fullWidth>
            <InputLabel>Collection</InputLabel>
            <Select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            >
              <MenuItem value="Todo">Todo</MenuItem>
            </Select>
          </FormControl>

          <div style={{ height: 24 }} />

          <FormControl fullWidth>
            <InputLabel>Action</InputLabel>
            <Select value={action} onChange={(e) => setAction(e.target.value)}>
              <MenuItem value="get">get</MenuItem>
              <MenuItem value="add">add</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Limit</InputLabel>
            <Select value={action}>
              <MenuItem value="get">get</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Code language="graphql" value={print(schema)} />
            </div>
            <div style={{ flex: 1 }}>
              <Code language="javascript" value={source} />
            </div>
          </div>
          <Firestoreql get="Todo">
            {(data) => (
              <Code language="json" value={JSON.stringify(data, null, 2)} />
            )}
          </Firestoreql>
        </div>
      </div>
    </BrowserqlProvider>
  )
}
