```javascript
import { get, last } from '@browserql/firestore'

await client.query(get('Todo', last()))
```
