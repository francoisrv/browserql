Count documents in a collection

```javascript
import { count } from '@browserql/firestore'

await client.query(firestoreql(schema).count('Todo'))
```
