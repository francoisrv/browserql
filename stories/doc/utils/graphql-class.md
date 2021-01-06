# Graphql Class

Use `GraphQL` to create classes with validation, formatting, required and default values included!

Just enter a schema and it will return you a class

```javascript
import graphql from '@browserql/graphql-schema-class'

const Todo = graphql`
  type Todo {
    title: String!
    done: Boolean @default(value: false)

    makeHTML: String! @method
  }
  type Query {
    getTodos: [Todo!]
  }
`

const todo = new Todo({ title: 'Buy milk' })

todo.toJSON()

Todo.resolve({
  Query: {
    async getTodos() {
      return await http.get('/todos')
    },
  },
})
```

```snapshot
GraphqlSchemaClass.Example
```

## How does it work

Just provide the type and it will generate a class that make sure its schema:

- is valid
- handles required fields
- handles default values
- handles value types and type formatting
- includes serializing
- can be extended
- has safe-type getters and setters

## Example with MongoDB

```javascript
// First we create a wrapper class that will extend our schema class with Mongodb
function graphql(schema) {
  const Schema = makeGraphqlSchemaClass(`
  scalar ObjectID
  scalar Date
  ${schema}
  `)
  return collectionName => abstract class MongodbClass extends Schema {
    static __resolvers = {
      ObjectID: ObjectIDResolver,
      Date: DateResolver,
    }

    static collection = collectionName

    static async function find(query) {
      const documents = await db.collection(MongodbClass.collection).find(query)
      return documents.map((document) => new Model(document))
    }

    async function save(document) {
      const _id = document.get('_id')
      const collection = db.collection(MongodbClass.collection)
      const doc = document.toObject()

      if (_id) {
        await collection.updateOne({ _id }, doc)
      } else {
        const { insertedId } = await collection.insertOne(doc)
        document.set('_id', insertedId)
      }
    }
  }
}

const Post = graphql`
  type Post {
    _id: ObjectID
    author: ObjectID!
    createdAt: Date! @default(function: "now")
    title: String!
  }
`('posts')

const Author = graphql`
  type Author {
    _id: ObjectId
    createdAt: Date! @default(function: "now")
    name: String!
  }
`('authors')

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

const scalars = ['scalar JSON', 'scalar EmailAddress']

const Todo = graphql`
  type Todo {
    title: String!
    done: Boolean = false
    email: EmailAddress!
  }
`

Todo.inject(
  gql`
    scalar JSON
    directive @foo on OBJECT
  `,
  {
    JSON: JSONResolver,
    '@foo': FooResolver,
  }
)

Todo.schema.addScalar('JSON', JSONResolver)

Todo.schema.addDirective('directive @foo on FIELD_DEFINITION')

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
