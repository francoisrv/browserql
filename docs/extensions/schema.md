# Schema

API on top of GraphQL for easier access

## Usage

```js
import enhanceSchema from "@browserql/schemax";

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
import enhanceSchema, { getKind } from "@browserql/schemax";

const schema = enhanceSchema(gql`
  type Todo {
    name: String!
  }
  type Query {
    getTodo: Todo
  }
`);

const Todo = schema.getQueryByName("getTodo");
console.log(getKind(Todo)); // Todo
```

### getName

Return the name of a GraphQL definition node

```js
import enhanceSchema, { getName } from "@browserql/schemax";

const schema = enhanceSchema(gql`
  type Todo {
    name: String!
  }
  type Query {
    getTodo: Todo
  }
`);

const queries = schema.getQueries();

queries.find((query) => getName(query) === "getTodo");
```

## API

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

### getQueryArguments

Return array of query arguments

```js
const schema = enhanceSchema(gql`
  type Query {
    foo(bar: Int, barz: Int): Int
  }
`);

const query = schema.getQueryByName("foo");
schema.getQueryArguments(query);
```

### getQueryByName

Get a query by name

```js
const schema = enhanceSchema(gql`
  type Query {
    foo: String
    bar: Int
    barz: [Boolean]
  }
`);

const query = schema.getQueryByName("foo");
```