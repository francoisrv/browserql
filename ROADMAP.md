# Road map

| Version | Title                 | Status        | ETA / Ship time |
| ------- | --------------------- | ------------- | --------------- |
| 1.3.0   | Simple client         | **Published** | Sep 28th 2020   |
| 1.6.0   | Resolvers             | **Published** | Sep 28th 2020   |
|         | Extensions            | In Progress   | October 2020    |
|         | Cache client          | _Backlog_     | October 2020    |
|         | Directives            | _Backlog_     | October 2020    |
|         | Http extension        | _Backlog_     | November 2020   |
|         | Rest extension        | _Backlog_     | November 2020   |
|         | Web sockets extension | _Backlog_     | November 2020   |
|         | Firestore extension   | _Backlog_     | November 2020   |
|         | CouchDB extension     | _Backlog_     | December 2020   |

## v1.0.0 Simple client

Allow user to use graphql client-side only by starting an in-memory server

```js
const { apollo } = connect({ schema });
// apollo is an Apollo client
```

## Resolvers

Add support for resolvers:

- [x] Queries
- [x] Mutations
- [x] Scalars
- [x] Directives

## Extended client

- [ ] Contracts
- [ ] Access

Contracts are pre-generated client queries and mutations, along with their fragments

```js
const client = connect({
  schema,
  extensions: {
    contracts: contracts(),
    cache: cache(),
  },
});
client.apollo.query({
  query: client.ext.contracts.query('getUser'),
  variables: { id: '1234' },
});

client.ext.cache.query.getUser({ id: '1234' });
client.ext.cache.mutate.insertUser({});
client.ext.cache.write.getUser({ id: '1234' }, { name: 'Foo' });
```
