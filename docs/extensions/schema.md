# FPQL

Functional Programming wrapper around GraphQL

## Usage

```js
import fp from '@browserql/fp'
import { getDirective, getQuery, getDirectiveValues } from '@browserql/fpql'

const schema = `
  directive @options on FIELD_DEFINITIONS
  type Query {
    hello: String ! @options(greetings: "Hi")
  }
`

fp(schema)(getQuery('hello'), getDirective('options'), getValues) // { greetings: 'Hi' }
```

## API

### getArgument

Return argument

```js
const schema = `
  type Query {
    foo(bar: Int, barz: Int): Int
  }
`

fp(schema)(getQuery('foo'), getArgument('bar')) // Arg bar
```

### getArguments

Return array of arguments

```js
const schema = `
  type Query {
    foo(bar: Int, barz: Int): Int
  }
`

fp(schema)(getQuery('foo'), getArguments) // [Arg bar, Arg barz]
```

### getByName

Get a definition by name

```js
const schema = `
  type A {
    id: ID
  }

  type B {
    id: ID
  }

  enum C {
    D
  }

  type Query {
    a: A
  }
`

getByName('C')(schema)
```

### getDirective

### getDirectives

### getKind

Return a kind as a string

```js
const schema = `
  type Todo {
    name: String!
  }
  type Query {
    getTodo: Todo!
  }
`

fp(schema)(getType('Todo'), getField('name'), getKind) // "String!"

fp(schema)(getQuery('getTodo'), getKind) // "Todo!"
```

### getName

Return the name of a GraphQL definition node

```js
const schema = `
  type Todo {
    name: String!
  }
`
fp(schema)(getQuery('Todo'), getFields, first, getName)
```

### getQueries

Return all queries in schema

```js
const schema = enhanceSchema(gql`
  type Query {
    foo: String
    bar: Int
    barz: [Boolean]
  }
  extend type Query {
    lambda: Float
  }
`)

const queries = getQueries()(schema) // foo, bar, barz, lambda

// Do not include extended queries
getQueries({ includeExtended: false }) // foo, bar, barz

// Return only extended queries
getQueries({ extendedOnly: true }) // lambda
```

### getQuery

```js
import enhanceSchema, { getKind } from '@browserql/schema'

const schema = enhanceSchema(gql`
  type Todo {
    name: String!
  }
  type Query {
    getTodo: Todo
  }
`)

getQuery('getTodo')(schema)
```

### getMutations

Return all mutations in schema

```js
const schema = enhanceSchema(gql`
  type Query {
    foo: String
  }
  type Mutation {
    A: ID
    B: ID
  }
  extend type Mutation {
    C: ID
  }
`)

const queries = schema.getMutations() // [A, B, C]
```

You can exclude extended mutations like this:

```js
const schema = enhanceSchema(gql`
  type Query {
    foo: String
  }
  type Mutation {
    A: ID
    B: ID
  }
  extend type Mutation {
    C: ID
  }
`)

const mutations = schema.getMutations({ includeExtended: false }) // [A, B]
```

Only get extended mutations

```js
const schema = enhanceSchema(gql`
  type Query {
    foo: String
  }
  type Mutation {
    A: ID
    B: ID
  }
  extend type Mutation {
    C: ID
  }
`)

const mutations = schema.getMutations({ extendedOnly: true }) // [C]
```

### getMutation

```js
const schema = enhanceSchema(gql`
  type Query {
    foo: String
  }
  type Mutation {
    A: ID
    B: ID
  }
`)

schema.getMutation('A')
```

### getType

Get a type by name

```js
const schema = enhanceSchema(gql`
  type A {
    id: ID
  }

  type B {
    id: ID
  }
`)

const type = schema.getType('A') // A
```

### getTypes

Get all types

```js
const schema = enhanceSchema(gql`
  type A {
    id: ID
  }

  type B {
    id: ID
  }

  enum C {
    D
  }

  type Query {
    a: A
  }
`)

const types = schema.getTypes() // [A, B]
```

### getValues

### merge

Merge different schemas

```js
const schema1 = gql`
  type Todo {
    id: ID!
    name: String!
  }

  type Query {
    getTodo: Todo
  }
`

const schema2 = gql`
  type Customer {
    id: ID!
    name: String!
  }

  type Query {
    getCustomer: Customer
  }
`

fp(merge(schema1, schema2))(getQuery('getCustomer'))
```

### parseKind

Return kind's info

```js
const schema = `
  type Todo {
    name: String!
  }
  type Query {
    getTodo: [Todo!]!
  }
`

const getTodo = getQuery('getTodo')(schema)
const kind = getKind(getTodo) // [Todo!]!
parseKind(kind)

// {
//   type: 'Todo',
//   depth: 1,
//   required: true,
//   nestedRequired: [true]
// }
```
