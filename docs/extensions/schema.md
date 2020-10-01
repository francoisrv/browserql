# Schema

API on top of GraphQL for easier access

## Usage

```js
import enhanceSchema from '@browserql/schemax';

const schema = enhanceSchema(gql`
  type Todo {
    name: String!
  }
  type Query {
    getTodo: Todo
  }
`);

const queries = schema.getQueries();
```

## Static API

### getKind

Return a kind as a string

```js
import enhanceSchema, { getKind } from '@browserql/schemax';

const schema = enhanceSchema(gql`
  type Todo {
    name: String!
  }
  type Query {
    getTodo: Todo!
  }
`);

const getTodo = schema.getQueryByName('getTodo');
console.log(getKind(getTodo)); // Todo!
```

### getName

Return the name of a GraphQL definition node

```js
import enhanceSchema, { getName } from '@browserql/schemax';

const schema = enhanceSchema(gql`
  type Todo {
    name: String!
  }
  type Query {
    getTodo: Todo
  }
`);

const queries = schema.getQueries();

queries.find((query) => getName(query) === 'getTodo');
```

### parseKind

Return kind's info

```js
import enhanceSchema, { getKind, parseKind } from '@browserql/schemax';

const schema = enhanceSchema(gql`
  type Todo {
    name: String!
  }
  type Query {
    getTodo: [Todo!]!
  }
`);

const getTodo = schema.getQueryByName('getTodo');
const kind = getKind(getTodo); // [Todo!]!
console.log(parseKind(kind));

// {
//   type: 'Todo',
//   depth: 1,
//   required: true,
//   nestedRequired: [true]
// }
```

## API

### getArguments

Return array of arguments

```js
const schema = enhanceSchema(gql`
  type Query {
    foo(bar: Int, barz: Int): Int
  }
`);

const foo = schema.getQueryByName('foo');
schema.getArguments(foo); // [bar, barz]
```

### getByName

Get a definition by name

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
`);

schema.getByName('C');
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
`);

const queries = schema.getQueries(); // foo, bar, barz, lambda
```

You can exclude extended queries like this:

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
`);

const queries = schema.getQueries({ includeExtended: false }); // foo, bar, barz
```

Only get extended queries

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
`);

const queries = schema.getQueries({ extendedOnly: true }); // lambda
```

### getQuery

```js
import enhanceSchema, { getKind } from '@browserql/schemax';

const schema = enhanceSchema(gql`
  type Todo {
    name: String!
  }
  type Query {
    getTodo: Todo
  }
`);

const getTodo = schema.getQuery('getTodo');
console.log(getKind(getTodo)); // Todo
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
`);

const queries = schema.getMutations(); // [A, B, C]
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
`);

const mutations = schema.getMutations({ includeExtended: false }); // [A, B]
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
`);

const mutations = schema.getMutations({ extendedOnly: true }); // [C]
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
`);

schema.getMutation('A');
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
`);

const type = schema.getType('A'); // A
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
`);

const types = schema.getTypes(); // [A, B]
```
