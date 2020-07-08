import gql from 'graphql-tag'
import buildTransactions, { makeReturnType, printTransaction, printTransactionWithArguments, makeTransactionSource } from './buildTransactions'
import Schema from './Schema'
import { find } from 'lodash'
import { InputValueDefinitionNode } from 'graphql'

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
      { type: 'Todo', result: { source: '{ ...browserqlFragment_Todo }' } },
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
      regex: RegExp
    }

    function makeTest(t: MakeSourceTest) {
      it(`should print ${ t.type } ${ t.name } with ${ t.args.length } arguments`, () => {
        const source = makeTransactionSource(t.type, t.name, t.args, t.kind, t.schema)
        console.log(source)
        expect(source).toMatch(t.regex)
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
        regex: /^\s+query \{\s+fetchAll\s+\}/
      }
    ]

    for (const t of tests) {
      makeTest(t)
    }
  })
})
