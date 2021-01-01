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







import {
  DocumentNode,
  InputObjectTypeDefinitionNode,
  InputObjectTypeExtensionNode,
} from 'graphql'

export default function getInputs(document: DocumentNode) {
  const { definitions } = document
  const next = definitions.filter(
    (def) =>
      def.kind === 'InputObjectTypeDefinition' ||
      def.kind === 'InputObjectTypeExtension'
  )
  return next as Array<
    InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode
  >
}

const getInputs = graphql`
  type Query {
    getInputs(document: DocumentNode): [
      InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode
    ]!
  }
`(document => {

})

getInputs.add


```
