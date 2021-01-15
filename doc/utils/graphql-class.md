# Graphql Schema Class

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "graphql-schema-class"
  }
}
```

Use `GraphQL` to create classes with validation, formatting, required and default values included!

Just enter a schema and it will return you a class

```javascript
import { GraphqlSchemaClass } from '@browserql/graphql-schema-class'

class Todo extends GraphqlSchemaClass {
  static schema = gql`
    input Todo {
      title: String!
      done: Boolean = false
    }
  `
}

const todo = new Todo({ title: 'Buy milk' })

todo.toJSON()
```

```snapshot
GraphqlSchemaClass.Example
```

## static schema

The schema to use.

By default we pick the first encountered type as the model.

```javascript
class Post extends GraphqlSchemaClass {
  static readonly schema = gql`
    type Post {
      title: String!
      tags: [Tag!]!
    }

    type Tag {
      tilte: String!
    }
  `
}

new Post({
  title: '...',
  tags: [{ title: '...' }]
})
```

## static type

Specify which type to use.

```javascript
const schema = gql`
  type Post {
    title: String!
    tags: [Tag!]!
  }

  type Tag {
    tilte: String!
  }
`

class Post extends GraphqlSchemaClass {
  static readonly schema = schema
  static readonly type = "Post"
}

class Tag extends GraphqlSchemaClass {
  static readonly schema = schema
  static readonly type = "Tag"
}

new Post({
  title: '...',
  tags: [new Tag({ title: '...' })]
})
```

## Class

### Constructor

When you construct a new instance, just pass the data.

**It has to be a valid schema**

```javascript
import graphql from '@browserql/graphql-schema-class'

const Todo = graphql`
  type Todo @schema {
    title: String!
    done: Boolean! = false
  }
`

const todo = new Todo({ title: 'Buy milk' })

todo.toJSON()
```

### get

### set

### toJSON

### toObject

### Custom methods

```graphql
type TodoSchema {
  id: ID!
  title: String!
  done: Boolean!
}
```

```graphql
type TodoModel {
  new(title: String!, done: Boolean = false): Todo @constructor

  paginate(page: Int = 1, size: Int = 25): [Todo!]! @static
  getById(id: ID!): Todo @static

  add(todo: AddableTodo!): Todo! @static
  update(id: ID!, todo: UpdatableTodo): Todo @static
  remove(id: ID!): Todo @static
}
```

```javascript
import graphql from '@browserql/graphql-schema-class'

const todos = []
let id = 1

const Todo = graphql({ schema, model }, {
  Query: {
    async paginate({ page, size }) {
      return todos.slice(page * size, size)
    }
    async getById({ id }) {
      return todos.find(todo => todo.id === id)
    }
  },
  Mutation: {
    async add({ title, done }) {
      id++
      const todo = new Todo({ title, done, id })
      todos.push(todo)
      return todo
    }
    async update({ id, title, done }) {}
    async remove({ id }) {}
  }
})

const todo = new Todo({ title: 'Buy milk' })

expect(todo.get('done')).toBe(false)

const { id } = await Todo.add(todo.toJSON())

todo.set({ done: true })

await Todo.update(id, todo.toJSON())

const { done } = await Todo.getById(id)

expect(done).toBe(true)
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
import gql from 'graphql-tag'
import { GraphqlSchemaClass } from '@browserql/graphql-schema-class'
import {
  ObjectIDResolver,
  DateResolver
} from 'graphql-scalars'
import { ObjectID } from 'mongodb'

class MongodbClass extends GraphqlSchemaClass {
  static schema = gql`
    input Post {
      _id:        ObjectID!
      author:     ObjectID!
      createdAt:  Date = now()
      title:      String!
    }

    input Author {
      _id:        ObjectID!
      createdAt:  Date = now()
      name:       String!
    }
  `

  static scalars = {
    ObjectID: ObjectIDResolver,
    Date: DateResolver,
  }

  static defaultFunctions = {
    now: () => new Date()
  }

  static async function find(query) {
    const documents = await db
      .collection(MongodbClass.collection)
      .find(query)
    return documents.map((document) => new Model(document))
  }

  defaults = {
    _id: new ObjectID()
  }

  isSaved = false

  async function save(document) {
    const _id = document.get('_id')
    const collection = db.collection(this.constructor.collection)
    const doc = document.toObject()

    if (this.isSaved) {
      await collection.updateOne({ _id }, doc)
    } else {
      const { insertedId } = await collection.insertOne(doc)
      document.set('_id', insertedId)
      this.isSaved = true
    }
  }
}

class Post extends MongodbClass {
  static input = "Post"
  static collection = "posts"
}

class Author extends MongodbClass {
  static input = "Author"
  static collection = "authors"
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
