import gql from 'graphql-tag'
import buildTransactions, { makeReturnType, printTransaction, printTransactionWithArguments } from './buildTransactions'
import Schema from './Schema'
import { find } from 'lodash'

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
  describe('Return type', () => {
    describe('Scalar', () => {
      it('make return type for built-in scalar', () => {
        const rt = makeReturnType('ID', schema)
        expect(rt).toEqual('')
      })
      it('make return type for built-in scalar with symbols', () => {
        const rt = makeReturnType('[ID!]!', schema)
        expect(rt).toEqual('')
      })
      it('make return type for custom scalar', () => {
        const rt = makeReturnType('[Foo!]!', schema)
        expect(rt).toEqual('')
      })
    })
    describe('Non scalar', () => {
      it('make return type for type', () => {
        const rt = makeReturnType('Todo', schema)
        expect(rt.trim()).toEqual(`{
  id 
  title 
  done 
  info {
    boomer 
  }
}`)
      })
      it('should return type for enum', () => {
        const rt = makeReturnType('Size', schema)
        expect(rt).toEqual('')
      })
    })
    
  })

  describe('Print transaction', () => {
    describe('Query', () => {
      it('should print query without arguments', () => {
        const query = schema.getQueryType()
        // @ts-ignore
        const field = find(query.fields, f => Schema.getName(f) === 'a')
        const t = printTransaction('query', field, schema)
        expect(t.trim()).toEqual(`query {
  a 
}`)
      })
      it('should print query with arguments', () => {
        const query = schema.getQueryType()
        // @ts-ignore
        const field = find(query.fields, f => Schema.getName(f) === 'b')
        const t = printTransactionWithArguments('query', field, schema)
        expect(t.trim()).toEqual(`query b (
  $c: ID
  $d: ID !
  $e: [ ID ! ]
) {
  b (
    c: $c
    d: $d
    e: $e
  ) 
}`)
      })
      it('should print query with non scalar kind', () => {
        const query = schema.getQueryType()
        // @ts-ignore
        const field = find(query.fields, f => Schema.getName(f) === 'c')
        const t = printTransaction('query', field, schema)
        expect(t.trim()).toEqual(`query {
  c {
    id 
    title 
    done 
    info {
      boomer 
    }
  }
}`)
      })
    })

    describe('Mutation', () => {
      it('should print mutation without arguments', () => {
        const mutation = schema.getMutationType()
        // @ts-ignore
        const field = find(mutation.fields, f => Schema.getName(f) === 'e')
        const t = printTransaction('mutation', field, schema)
        expect(t.trim()).toEqual(`mutation {
  e 
}`)
      })
      it('should print mutation with arguments', () => {
        const mutation = schema.getMutationType()
        // @ts-ignore
        const field = find(mutation.fields, f => Schema.getName(f) === 'f')
        const t = printTransactionWithArguments('mutation', field, schema)
        expect(t.trim()).toEqual(`mutation f (
  $c: ID
  $d: ID !
  $e: [ ID ! ]
) {
  f (
    c: $c
    d: $d
    e: $e
  ) 
}`)
      })
      it('should print mutation with non scalar kind', () => {
        const mutation = schema.getMutationType()
        // @ts-ignore
        const field = find(mutation.fields, f => Schema.getName(f) === 'g')
        const t = printTransaction('mutation', field, schema)
        expect(t.trim()).toEqual(`mutation {
  g {
    id 
    title 
    done 
    info {
      boomer 
    }
  }
}`)
      })
    })
  })
})
