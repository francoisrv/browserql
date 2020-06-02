browserql-default
===

Sets initial cache value for queries by using the directive `@default` or its alias `@initial`

## Query usage

You can set an initial default value to a query that will be returned if the query has not been cached yet

```js
import { connect } from 'browserql'
import defaultValue from 'browserql-default'

const schema = gql`
type Query {
  getVersion: String ! @default(value: "1.0.0")
}
`
const client = connect({
  schema,
  plugins: [defaultValue()]
})

const data = await client.query('getVersion')
console.log(data) // "1.0.0"
```

You can call a resolver to resolve the default value

```js
const schema = gql`
enum OS {
  apple
  windows
}

enum Messenger {
  Facetime
  Skype
}

type Query {
  getMessenger(
    os: OS = OS.apple
  ): Messenger
  @default(resolver: "getDefaultMessenger")
}
`
const resolvers = {
  getDefaultMessenger: ({ os }, { client }) => {
    if (os === client.schema.OS.apple) {
      return client.schema.Messenger.Facetime
    }
    return client.schema.Messenger.Skype
  }
}
const client = connect({
  schema,
  resolvers,
  plugins: [defaultValue()]
})

const data = await client.query('getMessenger', {
  os: client.schema.OS.apple
})
console.log(data) // "Facetime"
```

You can also have fixtures

```js
const schema = gql`
type Employee {
  firstname: String!
  position: String!
}

type Query {
  getEmployees: [Employee] @default(fixture: "employees")
}
`
const client = connect({
  schema,
  plugins: [defaultValue({
    fixtures: {
      employees: [
        {
          firstname: 'joy',
          position: 'developer'
        }
      ]
    }
  })]
})

const data = await client.query('getEmployees')
console.log(data) // [{firtsName: 'joy', position: 'developer'}]
```
