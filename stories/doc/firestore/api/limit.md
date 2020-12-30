```javascript
import { get, limit } from '@browserql/firestore'

await client.query(get('Todo', limit(25)))
```
