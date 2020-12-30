```javascript
import { increment, update } from '@browserql/firestore'

await client.query(update('Todo', increment()))
```
