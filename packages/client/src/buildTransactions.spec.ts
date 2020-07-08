import gql from 'graphql-tag'
import { makeReturnType, makeTransactionSource, buildTransaction, getTransactionFragments } from './buildTransactions'
import Schema from './Schema'
import { InputValueDefinitionNode, FieldDefinitionNode, FragmentDefinitionNode, DocumentNode, TypeNode } from 'graphql'
import SchemaFieldInputs from './Schema.fieldInputs'
import SchemaFields from './Schema.fields'
import SchemaKinds from './Schema.kinds'

describe('Build transactions', () => {
  describe('Return type', () => {
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
      e: SIZE
    }
    type Mutation {
      e: [ID]!
      f(c: ID, d: ID!, e: [ID!]): Int!
      g: [Todo]
    }
    `
    const schema = new Schema(Query)
    
    interface ReturnTypeTest {
      type: string
      result: string
    }

    function makeTest(t: ReturnTypeTest) {
      it(`${ t.type } >> ${ t.result }`, () => {
        const rt = makeReturnType(t.type, schema)
        expect(rt).toEqual(t.result)
      })
    }

    const tests: ReturnTypeTest[] = [
      { type: 'ID', result: '' },
      { type: '[ID!]!', result: '' },
      { type: 'Foo', result: '' },
      { type: '[Foo!]!', result: '' },
      { type: 'Todo', result: `{
    ...browserqlFragment_Todo
  }`
      },
      { type: 'Size', result: '' },
    ]

    for (const t of tests) {
      makeTest(t)
    }
  })

  describe('Transaction source', () => {
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

  describe.only('Transaction fragments', () => {
    interface FragmentTest {
      label: string
      type: TypeNode
      schema: DocumentNode
      fragments: string[]
    }

    function makeTest(t: FragmentTest) {
      it(t.label, () => {
        const fragments = getTransactionFragments(t.type, new Schema(t.schema))
        expect(fragments).toHaveLength(t.fragments.length)
        t.fragments.forEach((fragment, index) => {
          expect(Schema.getName(fragments[index])).toEqual(fragment)
        })
      })
    }

    const tests: FragmentTest[] = [
      // {
      //   label: 'with 1 fragment',
      //   type: SchemaKinds.buildKind('Todo'),
      //   fragment: 'browserqlFragment_Todo',
      //   schema: gql`
      //   type Todo {
      //     id: ID!
      //   }
      //   fragment browserqlFragment_Todo on Todo {
      //     id
      //   }
      //   `
      // },
      {
        label: 'with nested fragments',
        type: SchemaKinds.buildKind('Player'),
        fragments: ['browserqlFragment_Player', 'browserqlFragment_Team'],
        schema: gql`
        type Team {
          name: String
        }
        type Player {
          name: String
          team: Team
        }
        fragment browserqlFragment_Team on Team {
          name
        }
        fragment browserqlFragment_Player on Player {
          name
          team {
            ...browserqlFragment_Team
          }
        }
        `
      }
    ]

    for (const t of tests) {
      makeTest(t)
    }
  })

  describe('Build transaction', () => {
    interface MakeTransactionTest {
      field: FieldDefinitionNode,
      type: 'query' | 'mutation'
      schema: Schema
      source: string
      name: string
      fragments: string[]
    }

    function makeTest(t: MakeTransactionTest) {
      it(t.source, () => {
        const { source, name, fragments } = buildTransaction(
          t.field,
          t.type,
          t.schema
        )
        expect(name).toEqual(t.name)
        expect(source).toEqual(t.source)
        expect(fragments).toHaveLength(t.fragments.length)
        t.fragments.forEach((fragment, index) => {
          expect(Schema.getName(fragments[index])).toEqual(fragment)
        })
      })
    }

    const tests: MakeTransactionTest[] = [
      {
        type: 'query',
        field: SchemaFields.buildField('get', 'Boolean!'),
        schema: new Schema(gql`
        type Query {
          get: Boolean!
        }
        `),
        name: 'get',
        source: `
query {
  get 
}
`,
        fragments: []
      },
      {
        type: 'query',
        field: SchemaFields.buildField('get', 'Boolean!', {
          inputs: [['id', 'ID!'], ['name', 'MyInput']]
        }),
        schema: new Schema(gql`
        input MyInput {
          foo: Int!
        }
        type Query {
          get(id: ID! name: MyInput): Boolean!
        }
        `),
        name: 'get',
        source: `
query(
  $id: ID !
  $name: MyInput
) {
  get(
    id: $id
    name: $name
  ) 
}
`,
        fragments: []
      },
      {
        type: 'query',
        field: SchemaFields.buildField('get', 'Barz!', {
          inputs: [['id', 'ID!'], ['name', 'MyInput']]
        }),
        schema: new Schema(gql`
        input MyInput {
          foo: Int!
        }
        type Barz {
          done: Boolean!
        }
        fragment browserqlFragment_Barz on Barz {
          done
        }
        type Query {
          get(id: ID! name: MyInput): Barz!
        }
        `),
        name: 'get',
        source: `
query(
  $id: ID !
  $name: MyInput
) {
  get(
    id: $id
    name: $name
  ) {
    ...browserqlFragment_Barz
  }
}
`,
        fragments: ['browserqlFragment_Barz']
      },
    ]

    for (const t of tests) {{
      makeTest(t)
    }}
  })
})
