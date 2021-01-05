# Typescript generator

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "typescript-generator"
  }
}
```

Generate typescript as a string from any `GraphQLNode` node

## Try it

Edit the `GraphQL input` below to view its generated `Typescript output`.

```snapshot
TypescriptGenerator.TryIt
```

## Usage

Let's take a simple `GraphQL` schema:

```graphql
type User {
  name: String!
  age: Int
}
```

```javascript
import gents from '@browserql/typescript-generator'

gents(schema)
```

Which will return the following **string**:

```snapshot
TypescriptGenerator.Usage
```

```section
Enumerations
utils/typescript-generator/enumeration
```

```section
Extensions
utils/typescript-generator/extension
```

```section
Lists and arrays
utils/typescript-generator/list
```

```section
Methods
utils/typescript-generator/methods
```

```section
Nullable
utils/typescript-generator/null
```

```section
Scalar conversion
utils/typescript-generator/scalars
```
