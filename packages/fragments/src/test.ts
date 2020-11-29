import gql from 'graphql-tag'

import buildFragments from '.'

test('test', () => {
  console.log(
    buildFragments(gql`
      type Foo {
        a: ID
        b: String
        c: Int
        d: Float
        e: Boolean
      }
    `).printAll()
  )
  // expect(
  //   buildFragments(gql`
  //     type Foo {
  //       a: ID
  //       b: String
  //       c: Int
  //       d: Float
  //       e: Boolean
  //     }
  //   `).get('Foo')
  // ).toEqual(`
  // fragment FooFragment on Foo {
  //   a
  //   b
  //   c
  //   d
  //   e
  // }
  // `)
})
