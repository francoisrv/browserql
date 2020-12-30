# GraphiQL

`browserql` implementation for [GraphiQL](http://graphiql.com)

## Usage

```javascript
import { BrowserqlProvider } from '@browserql/schema'
import GraphiQL from '@browserql/graphiql'

function Provider() {
  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <GraphiQL />
    </BrowserqlProvider>
  )
}
```

```snapshot
GraphiQL.Example
```
