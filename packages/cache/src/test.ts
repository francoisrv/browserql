const schema = `
type Todo {
  id: ID!
}

type Query @cache {
  getTodo(id: ID!): Todo
}

type Mutation {
  addTodo(id: ID!): Cache @push(type: "Todo")
}

type State @state {
  flag: Boolean!
  selectedTodo: Todo
}
`