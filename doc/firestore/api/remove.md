```javascript
import { remove, where } from '@browserql/firestore'

await client.query(remove('Todo', where('done').equals(true)))
```
