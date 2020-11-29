# Fragments

Generate fragments from types (_GraphQL_)

## Example

```graphql
# schema.graphql
type Post {
  title: String!
  author: Author!
}

type Author {
  name: String!
  email: String
}
```

```javascript
import schema from './schema.graphql'
import buildFragments from '@browserql/fragments'

const fragments = buildFragments(schema)
fragments.get('Post')
```

```graphql
fragment PostFragment on Post {
  name
  author {
    ...AuthorFragment
  }
}

fragment AuthorFragment on Author {
  name
  email
}
```

You can also select the fields:

```javascript
fragments.get('Post', 'author.name')
```

```graphql
fragment PostFragment on Post {
  author {
    ...AuthorFragment
  }
}

fragment AuthorFragment on Author {
  name
}
```
