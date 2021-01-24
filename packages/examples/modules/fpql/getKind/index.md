Get node's kind as a string

```graphql
type Query {
  getUser(id: ID!, includeSettings: Boolean = false): User
}
```

```javascript
fp(schema)(getQuery('getUser'), getKind)
```

```snapshot2
FPQL.GetFieldKind
```

```javascript
fp(schema)(getQuery('getUser'), getArgument('includeSettings'), getKind)
```

```snapshot2
FPQL.GetArgumentKind
```