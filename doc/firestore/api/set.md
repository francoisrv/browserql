```javascript
import { update, set } from '@browserql/firestore'

await client.query(update('Todo', set('done').to(false)))
```
