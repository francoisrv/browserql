# fp

Functional-Programming wrapper

```javascript
import fp from '@browserql/fp'

fp([1, 2, 3])(
  (numbers) => numbers.map((number) => number + 10), // [10, 20, 30]
  (numbers) => numbers.reduce((sum, number) => sum + number) // 60
) // 60
```

## Error handling

```javascript
fp()(
  () => throw new Error('Oops'), // Error: Oops
  (error) => error.message // "Oops"
) // "Oops"
```

## With promises

```javascript
fp.promises([1, 2, 3])(async (numbers) => http.post('/v1', numbers))
```
