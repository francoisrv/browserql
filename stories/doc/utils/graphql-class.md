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
import graphql from '@browserql/graphql-fp'

const Todo = graphql`
  type Todo {
    title: String!
    done: Boolean = false
  }
`

const todo = Todo({ title: 'Buy milk' })

todo.toJSON()

todo.set({ done: true })

todo.toJSON()
```

## Example with MongoDB

```javascript
async function find(Model, query) {
  const documents = await db.collection(Model.collection).find(query)
  return documents.map((document) => new Model(document))
}

async function save(Model, document) {
  const _id = document.get('_id')
  const collection = db.collection(Model.collection)
  const doc = document.data()

  if (_id) {
    await collection.updateOne({ _id }, doc)
  } else {
    const { insertedId } = await collection.insertOne(doc)
    document.set('_id', insertedId)
  }
}

class Post extends (graphql`
  type Post {
    _id: ObjectId
    author: ObjectID!
    createdAt: Date! @default(function: "now")
    title: String!
  }
`) {
  static collection = 'posts'

  static async find(query) {
    return find(Post, query)
  }

  save() {
    save(Post, this)
  }
}

class Author extends (graphql`
  type Author {
    _id: ObjectId
    createdAt: Date! @default(function: "now")
    name: String!
  }
`) {
  static collection = 'authors'

  static async find(query) {
    return find(Author, query)
  }

  save() {
    save(Author, this)
  }
}

const author = new Author({ name: 'doe' })

author.toJSON()

await author.save()

const post = new Post({
  title: 'My new post',
  author: author.get('_id'),
})

await post.save()
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
