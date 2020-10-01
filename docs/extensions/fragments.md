# Fragments

Auto-generate fragments for query and mutation kinds

## Usage

```js
import gql from "graphql-tag";
import buildFragments from "@browserql/fragmentsx";

const schema = gql`
  type Todo {
    id: ID!
    name: String!
    done: Boolean!
  }

  type Query {
    getTodo: Todo
  }
`;

const fragments = buildFragments(schema);

apolloClient.query({
  query: `
  query {
    getTodo {
      ...TodoFragment
    }
  }
  ${fragments.get("Todo")}
  `,
});
```

## Nested fragments

```js
import gql from "graphql-tag";
import buildFragments from "@browserql/fragmentsx";

const schema = gql`
  type Category {
    id: ID!
    name: String!
  }

  type Todo {
    id: ID!
    name: String!
    done: Boolean!
    category: Category!
  }

  type Query {
    getTodo: Todo
  }
`;

const fragments = buildFragments(schema);
console.log(fragments.get("Todo"))`
fragment TodoFragment on Todo {
  id
  name
  done
  ...CategoryFragment
}

fragment CategoryFragment on Category {
  id
  name
}
`;
```
