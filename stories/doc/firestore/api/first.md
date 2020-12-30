```javascript
import { first, get } from '@browserql/firestore'

await client.query(get('Todo', first()))
```
