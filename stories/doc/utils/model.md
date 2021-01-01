# Graphql Class

Use `GraphQL` to create classes! Just enter a schema and it will return you a class

```javascript
import graphql from '@browserql/graphql-class'

const Todo = graphql`
  type Todo {
    title: String!
    done: Boolean = false
  }
`

new Todo({ title: 'Buy milk' }).toJSON()
```

```json
{
  "title": "Buy milk",
  "done": false
}
```

```javascript
import graphql from '@browserql/graphql-class'

const Todo = graphql`
  type Todo {
    title: String!
    done: Boolean = false
  }
`

Todo.resolve('scalar', MyScalar)

const todo = new Todo() // Error: Missing field Todo.title

const todo = new Todo({ title: 'Buy milk' })

todo.get('title') // "Buy milk"

todo.get('done') // false

todo.set('done', 'Buy milk') // Error: Field Todo.done should be a Boolean

todo.set('done', true)

todo.toJSON() // { "title": "Buy milk", "done": true }

const sayHello = graphql`
  type Query {
    sayHello(to: String!): String!
  }
`(({ to }) => `hello ${to}`)

sayHello() // Missing required field sayHello.to

const Post = graphql`
  type Post {
    title: String!
    author: Author!
  }
`

const Author = graphql`
  type Author {
    name: String!
  }
`

Post.resolve('Author', Author)

class Post extends (graphql`
  type Post {
    title: String!
    author: Author!
  }
`) {
  static foo = 2
  bar = true
}
```
