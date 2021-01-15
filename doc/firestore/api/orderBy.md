```javascript
import { get, orderBy } from '@browserql/firestore'

await client.query(get('Todo', orderBy('priority')))
```
