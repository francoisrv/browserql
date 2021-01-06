import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import * as React from 'react'
import Code from '../components/Code'
import gql from 'graphql-tag'
import { print } from 'graphql'

function makeSource(collection: string, action: string) {
  return `function View() {
  return (
    <Firestorel ${action}="${collection}" limit={50}>
      {todos => <div>{JSON.stringify(todos)}</div>}
    </firestoreql>
  )
}`
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

  React.useEffect(() => {
    setSource(makeSource(collection, action))
  }, [collection, action])

  return (
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
        <Code
          language="json"
          value={JSON.stringify(
            [
              {
                id: '1234',
                title: 'Buy milk',
                done: true,
              },
            ],
            null,
            2
          )}
        />
      </div>
    </div>
  )
}
