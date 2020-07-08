import gql from 'graphql-tag'
import buildTransactions, { makeReturnType, printTransaction, printTransactionWithArguments, makeTransactionSource } from './buildTransactions'
import Schema from './Schema'
import { find } from 'lodash'
import { InputValueDefinitionNode } from 'graphql'
import SchemaFields from './Schema.fields'
import SchemaArguments from './Schema.arguments'
import SchemaFieldInputs from './Schema.fieldInputs'

describe('Build transactions', () => {
  const Query = gql`
  scalar Foo
  enum Size {
    SMALL
    MEDIUM
    LARGE
  }
  type TodoInfo {
    boomer: Boolean
  }
  type Todo {
    id: ID!
    title: String!
    done: Boolean!
    info: TodoInfo!
  }
  type Query {
    a: [ID]!
    b(c: ID, d: ID!, e: [ID!]): Int!
    c: [Todo]
    d: Foo
  }
  type Mutation {
    e: [ID]!
    f(c: ID, d: ID!, e: [ID!]): Int!
    g: [Todo]
  }
  `
  const schema = new Schema(Query)
  // console.log(schema.toString())
  describe('Return type', () => {
    interface ReturnTypeTest {
      type: string
      result: { source: string }
    }

    function makeTest(t: ReturnTypeTest) {
      it(`${ t.type } >> ${ t.result.source }`, () => {
        const rt = makeReturnType(t.type, schema)
        expect(rt).toEqual(t.result)
      })
    }

    const tests: ReturnTypeTest[] = [
      { type: 'ID', result: { source: '' } },
      { type: '[ID!]!', result: { source: '' } },
      { type: 'Foo', result: { source: '' } },
      { type: '[Foo!]!', result: { source: '' } },
      { type: 'Todo', result: { source: `{
    ...browserqlFragment_Todo
  }` } },
      { type: 'Size', result: { source: '' } },
    ]

    for (const t of tests) {
      makeTest(t)
    }
  })

  describe('Make transaction source', () => {
    interface MakeSourceTest {
      type: 'query' | 'mutation'
      name: string
      args: Readonly<InputValueDefinitionNode[]>
      kind: string
      schema: Schema
      source: string
    }

    function makeTest(t: MakeSourceTest) {
      it(t.source, () => {
        const source = makeTransactionSource(t.type, t.name, t.args, t.kind, t.schema)
        expect(source).toEqual(t.source)
      })
    }

    const tests: MakeSourceTest[] = [
      {
        type: 'query',
        name: 'fetchAll',
        args: [],
        kind: 'String',
        schema: new Schema(gql`
        type Query { fetchAll: String }
        `),
        source: `
query {
  fetchAll 
}
`
      },
      {
        type: 'mutation',
        name: 'changeAll',
        args: [],
        kind: 'Boolean',
        schema: new Schema(gql`
        type Mutation { changeAll: Boolean }
        `),
        source: `
mutation {
  changeAll 
}
`
      },
      {
        type: 'query',
        name: 'getTodo',
        args: [
          SchemaFieldInputs.buildFieldInput('id', 'ID'),
          SchemaFieldInputs.buildFieldInput('name', 'String!'),
        ],
        kind: 'Boolean',
        schema: new Schema(gql`
        type Query { getTodo(id: ID name: String!): Boolean }
        `),
        source: `
query(
  $id: ID
  $name: String !
) {
  getTodo(
    id: $id
    name: $name
  ) 
}
`
      },
      {
        type: 'mutation',
        name: 'updateTodo',
        args: [
          SchemaFieldInputs.buildFieldInput('id', 'ID'),
          SchemaFieldInputs.buildFieldInput('name', 'String!'),
        ],
        kind: 'Boolean',
        schema: new Schema(gql`
        type Query { updateTodo(id: ID name: String!): Boolean }
        `),
         source: `
mutation(
  $id: ID
  $name: String !
) {
  updateTodo(
    id: $id
    name: $name
  ) 
}
`
      },

      {
        type: 'query',
        name: 'getTodo',
        args: [],
        kind: 'Todo',
        schema: new Schema(gql`
        type Todo {
          id: ID!
          name: String!
        }
        type Query { getTodo: Todo }
        `),
        source: `
query {
  getTodo {
    ...browserqlFragment_Todo
  }
}
`
      },
      {
        type: 'mutation',
        name: 'updateTodo',
        args: [],
        kind: 'Todo',
        schema: new Schema(gql`
        type Todo {
          id: ID!
          name: String!
        }
        type Mutation { updateTodo: Todo }
        `),
        source: `
mutation {
  updateTodo {
    ...browserqlFragment_Todo
  }
}
`
      },
      {
        type: 'query',
        name: 'viewTodo',
        args: [
          SchemaFieldInputs.buildFieldInput('id', 'ID'),
          SchemaFieldInputs.buildFieldInput('name', 'String!'),
        ],
        kind: 'Todo',
        schema: new Schema(gql`
        type Todo {
          id: ID!
          name: String!
        }
        type Query { viewTodo(id: ID name: String!): Todo }
        `),
        source: `
query(
  $id: ID
  $name: String !
) {
  viewTodo(
    id: $id
    name: $name
  ) {
    ...browserqlFragment_Todo
  }
}
`
      },
      {
        type: 'mutation',
        name: 'deleteTodo',
        args: [
          SchemaFieldInputs.buildFieldInput('id', 'ID'),
          SchemaFieldInputs.buildFieldInput('name', 'String!'),
        ],
        kind: 'Todo',
        schema: new Schema(gql`
        type Todo {
          id: ID!
          name: String!
        }
        type Query { deleteTodo(id: ID name: String!): Todo }
        `),
         source: `
mutation(
  $id: ID
  $name: String !
) {
  deleteTodo(
    id: $id
    name: $name
  ) {
    ...browserqlFragment_Todo
  }
}
`
      },
    ]

    for (const t of tests) {
      makeTest(t)
    }
  })
})
