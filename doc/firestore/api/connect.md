```javascript
import { connect } from '@browserql/client'
import { connect as connectFirestore } from '@browserql/firestore'

const browserql = connect(connectFirestore(db, defs))
```
