browserql
===

Use graphql in the browser 🚀

**browserql usually works better with [plugins](/plugins.md)**

## Why?

- powerful state management of your front-end app via apollo cache
- easy-to-reason code layout
- query first set mind
- all-in-the-browser

## Usage

```js
import { connect } from 'browserql'

const schema = `
type Query {
  hello(name: String!): String!
}
`
const resolvers = {
  hello: ({ name }) => `hello ${ name }`
}

const client = connect({ schema, resolvers })

const { data } = client.query({
  query: client.queries.hello,
  variables: { name: 'foo' }
})

data.hello // "hello foo"
```

## connect

```ts
declare function connect(options: ConnectOptions): BrowserQLClient
```

### options

```ts
type Schema =
| DocumentNode
| GraphQLSchema
| string

interface ConnectOptions {
  schema:         Schema | Schema[]

  assumeValid?:   boolean
  plugins?:       PluginCaller[]
  resolvers?:     { [name: string]: Function }
}
```

#### schema

You can pass either a string, a document node or a graphQL schema object -- or an array with any of these three.

#### assumeValid

The schema needs te be valid, unless specified otherwise via the `assumeValid` option:

```js
connect({ schema, assumeValid: false })
```

#### plugins

Plugins can:

- extend schema
- extend resolvers
- extend context

```ts
type PluginCaller = (...args: any[]) => PluginInvoker

type PluginInvoker = (
  schema:       GraphQLSchema,
  resolvers:    { [name: string]: Function },
  context:      object
) => Plugin

interface Plugin {
  schema:       GraphQLSchema
  resolvers:    { [name: string]: Function }
  context:      object
}
```

```js
import {
  getTypesWithDirective,
  getName,
  printDirective,
  DIRECTIVE_LOCATION
} from 'browserql-utils'

// Add an id field to a type
function modelDirective(schema) {
  return {
    schema: [
      printDirective('model', DIRECTIVE_LOCATION.OBJECT),
      ...getTypesWithDirective('model', schema).map(
        type => `extend type ${ getName(type) } { id: ID! }`
      )
    ]
  }
}

const schema = 'type Model @model { title: String! }'

const client = connect({ schema, plugins: [modelDirective] })

client.printType('Model')
// type Model {
//   id: ID!
//   title: String!
// }
```

#### resolvers

```js
const schema = `
type Query {
  ping: String
}

type Mutation {
  pong: string
}
`
const resolvers = {
  ping: () => 'pong',
  pong: () => 'ping'
}

connect({ schema, resolvers })
```

### client

```ts
interface Client {

}
```
