# Road map

| Version | Title                 | Status      | ETA / Ship time |
| ------- | --------------------- | ----------- | --------------- |
| 1.0.0   | Simple client         | In progress | Sep 27th 2020   |
| 1.0.0   | Extended client       | Backlog     | Sep 27th 2020   |
| 3.0.0   | Cache client          | Backlog     | Sep 28th 2020   |
| 4.0.0   | Resolvers             | Backlog     | Oct 4th 2020    |
| 5.0.0   | Directives            | Backlog     | Oct 19th 2020   |
| 6.0.0   | Http extension        | Backlog     | Oct 19th 2020   |
| 7.0.0   | Rest extension        | Backlog     | Oct 19th 2020   |
| 8.0.0   | Web sockets extension | Backlog     | Oct 19th 2020   |
| 9.0.0   | Firestore extension   | Backlog     | Oct 19th 2020   |
| 10.0.0  | CouchDB extension     | Backlog     | Oct 19th 2020   |

## v1.0.0 Simple client

Allow user to use graphql client-side only by starting an in-memory server

```js
const { apollo } = connect({ schema })

// apollo is an Apollo client, you can use ie
<ApolloProvider client={ apollo }>
  // ...
</ApolloProvider>
```
