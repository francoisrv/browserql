```javascript
import { update, multiply } from '@browserql/firestore'

await client.query(update('Todo', multiply(0.5)))
```
