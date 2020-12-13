# Fragments

Generate fragments from types (_GraphQL_)

## Example

Let's take a `GraphQL` schema

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

Now let's import it along with our fragment builder

```javascript
import schema from './schema.graphql'
import { buildFragment } from '@browserql/fragments'
```

You can now build a fragment specifying the target type

```javascript
buildFragment(schema, 'Author')
```

Which will generate the following string:

```snapshot
FragmentsExample
```

Note that if the type is using other types, it will also build fragments for these types:

```javascript
buildFragment(schema, 'Post')
```

Which will generate the following string:

```snapshot
FragmentsExampleNested
```

You can also select the fields:

```javascript
buildFragment(schema, 'Post', {
  select: ['title'],
})
```

```snapshot
FragmentsExampleSelect
```

You can use dot notation to reach nested fields

```javascript
buildFragment(schema, 'Post', {
  select: ['author'],
  showNetwork: false,
})
buildFragment(schema, 'Author', {})
```

```snapshot
FragmentsSelectDotNotation
```
