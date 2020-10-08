# Fauna

```graphql
@fauna
type Todo {
  name: String! @fauna(index: "todo_by_name")
  done: Boolean! @default(value: false) @fauna(index: "todo_by_done")
}
```

```js
resolved.Query.faunaFindMany({
  collection: 'Todo',
  where: [{ field: 'done', value: false }],
  size: 10,
})
resolved.Query.faunaInsertOne({
  collection: 'Todo',
  data: { name: 'Buy milk' },
})
```
