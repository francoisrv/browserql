```javascript
import { get, limit, page } from '@browserql/firestore'

await client.query(get('Todo', limit(100), page(5)))
```
