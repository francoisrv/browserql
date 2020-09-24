# Resolvers

An object where to put the mutation resolvers.

Note that mutations are supposed to handle side-effects and/or write to the cache, so they do not return anything.

A resolver's name must match a mutation's name in the [schema](doc/schema).

A resolver's only argument is the browserql client.

It must wrap a function that can be asynchronous.

## Example

```js
const addTodo = (client) => async ({ name }) => {
  // Any side effects
  // You can interact with the client, like writing to the cache;
  client.write("getTodos", {}, [{ name }]);
};
```
