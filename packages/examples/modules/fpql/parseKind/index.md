Parse a kind string into an object like this:

```typescript
interface ParsedType {
  defaultValue?: any
  depth: number
  nestedRequired: boolean[]
  required: boolean
  type: string
}
```

```javascript
parseKind('ID')
```

```snapshot
FPQL.ParseKind
```

```javascript
parseKind('ID!')
```

```snapshot
FPQL.ParseKindRequired
```

```javascript
parseKind('[ID!]!')
```

```snapshot
FPQL.ParseKindList
```

```javascript
parseKind('Int = 0')
```

```snapshot
FPQL.ParseKindDefault
```
