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
abstract class MongoModel {
  static async find(query) {
    const documents = await db.collection(MongoModel.collection).find(document)
    return documents.map(document => new MongoModel(document))
  }

  document

  constructor(document) {
    this.document = document
  }

  async save() {
    const collection = db.collection(MongoModel.collection)
    if (this.document._id) {
      await collection.updateOne(
        { _id: this.document._id },
        this.document,
      )
    } else {
      const { _id } = await collection.insertOne(this.document)
      this.document._id = _id
    }
  }
}

const Author = graphql`
  scalar MongoModel

  type Author @schema(extends: MongoModel) {
    id: ObjectID!
    name: String!
    createdAt: Date! @default(function: "now")
  }
`

const Document = graphql`
  type Document {
    _id: ObjectID!
    name: String!
    createdAt: Date! @default(function: "now")
  }
`

function mongolify(fn) {
  fn.define('collection', (ctx, { schema }) => db.collection(schema.getDirectiveArgumentValue('schema.collection')))

  fn.extend('save', ctx => function save() {
    if (ctx.get('_id')) {
      ctx.getDefininition('collection').updateOne({
        { _id: ctx.get('_id') } ,
        ctx.json()
      })
    }
  })
}


const Post = graphql`
  type Post @schema(collection: "posts") {
    id: ObjectID!
    title: String!
    createdAt: Date! @default(function: "now")
    author: ObjectID! @rel(type: "Author")
  }
`

class Post extends PostSchema implements MongoModel {
  static collection = "posts"
}

const author = new Author({ 'name': 'doe' }) // Missing _id

author.toJSON()

await author.save()

const post = new Post({
  title: 'My new post',
  author: author.get('_id')
})
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
