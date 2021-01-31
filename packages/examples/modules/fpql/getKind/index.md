Get node's kind as a string

{{ show schema-get-query-kind.graphql }}

{{ show snippet-get-query-kind.mjs }}

{{ render view-get-query-kind.tsx }}

```javascript
fp(schema)(getQuery('getUser'), getArgument('includeSettings'), getKind)
```

```snapshot2
FPQL.GetArgumentKind
```
