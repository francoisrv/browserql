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
