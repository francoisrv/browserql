# Road map

| Version | Title                 | Status      | ETA / Ship time |
| ------- | --------------------- | ----------- | --------------- |
| 1.0.0   | Simple client         | In progress | Sep 27th 2020   |
| 2.0.0   | Resolvers             | Backlog     | October 2020    |
| 3.0.0   | Extended client       | Backlog     | October 2020    |
| 4.0.0   | Cache client          | Backlog     | October 2020    |
| 5.0.0   | Directives            | Backlog     | October 2020    |
| 6.0.0   | Http extension        | Backlog     | November 2020   |
| 7.0.0   | Rest extension        | Backlog     | November 2020   |
| 8.0.0   | Web sockets extension | Backlog     | November 2020   |
| 9.0.0   | Firestore extension   | Backlog     | November 2020   |
| 10.0.0  | CouchDB extension     | Backlog     | December 2020   |

## v1.0.0 Simple client

Allow user to use graphql client-side only by starting an in-memory server

```js
const { apollo } = connect({ schema });
// apollo is an Apollo client
```
