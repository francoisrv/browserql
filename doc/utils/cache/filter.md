Filter cache results

```graphql
type Query {
  getScores: [Int!]! @default(value: [])
}
```

```javascript
const GET_SCORES = gql`
  {
    getScores
  }
`

cached.get(GET_SCORES) // []

cached.push(GET_SCORES, 100, 75, 25)

cached.get(GET_SCORES) // [100, 75, 25]

cached.filter(GET_SCORES, (num) => num > 50)

cached.get(GET_SCORES) // [100, 75]
```
