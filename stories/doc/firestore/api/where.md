```javascript
import { get, where } from '@browserql/firestore'

await client.query(get('Todo', where('done').equals(true)))
```
