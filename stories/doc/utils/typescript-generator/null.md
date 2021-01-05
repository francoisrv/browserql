You can choose which strategy to use to represent values that might be `null`.

You can sppecify the strategy like this:

```javascript
gents(schema, { null: NULL_STRATEGY })
```

You can use more than one strategy

```javascript
gents(schema, { null: ['missng', 'null'] })
```

In `Typescript`, use the `NULL_STRATEGY` `enum`:

```javascript
import gents from '@browserql/typescript-generator'
import type { NULL_STRATEGY } from '@browserql/typescript-generator'

gents(schema, { null: NULL_STRATEGY.null })
```

### Strategies

These are the strategies:

- **null**
- **undefined**
- **missing**

Imagine the following `GraphQL` schema where `bar` is `nullable` in `GraphQL`

```graphql
type Foo {
  bar: String
}
```

| code                 | `{ null: 'null' }`                                    | `{ null: 'undefined' }`                                    | `{ null: 'missing' }`                                                |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| `{ bar: 'a' }`       | **OK**                                                | **OK**                                                     | **OK**                                                               |
| `{}`                 | **ERROR** Missing field `bar`                         | **ERROR** Missing field `bar`                              | **OK**                                                               |
| `{ bar: null }`      | **OK**                                                | **ERROR** `bar` should be either a `string` or `undefined` | **ERROR** `bar` should be either a `string`, `undefined`, or missing |
| `{ bar: undefined }` | **ERROR** `bar` should be either a `string` or `null` | **OK**                                                     | **OK**                                                               |

### The `null` strategy

The defaut strategy is `null` -- which is the default in GraphQL.

It means all fields must be present, even the optional ones, who need to be set to `null` if their value is missing

```graphql
type Foo {
  bar: String
}
```

```javascript
gents(schema, { null: 'null' })
// Since this is the default version, this is the same as:
gents(schema)
```

```snapshot
TypescriptGenerator.NullableWithNull
```

### The `undefined` strategy

You could also set `null` as `undefined`. This means optional fields without value must be undefined.

```javascript
gents(schema, { null: 'undefined' })
```

```snapshot
TypescriptGenerator.NullableWithUndefined
```

### The `missing` strategy

This means the field does not have to be present if it is not required.

```javascript
gents(schema, { null: 'missing' })
```

```snapshot
TypescriptGenerator.NullableWithMissing
```

### Using more than one strategy

This means the field does not have to be present if it is not required.

```javascript
gents(schema, { null: ['missing', 'null'] })
```

```snapshot
TypescriptGenerator.NullableWithMixed
```
