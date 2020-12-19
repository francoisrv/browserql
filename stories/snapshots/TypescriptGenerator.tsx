import * as React from 'react'
import gents from '@browserql/typescript-generator'
import gql from 'graphql-tag'
import Code from '../components/Code'

export function Usage() {
  const schema = gql`
    type User {
      name: String!
      age: Int
    }
  `

  return <Code language="typescript" value={gents(schema).trim()} />
}

export function Kinds() {
  const schema = gql`
    type Foo {
      a: Boolean
      b: Float
      c: ID
      d: Int
      e: String
    }
  `

  return <Code language="typescript" value={gents(schema).trim()} />
}

export function NonNull() {
  const schema = gql`
    type Foo {
      id: ID
    }
  `

  return <Code language="typescript" value={gents(schema).trim()} />
}

export function Lists() {
  const schema = gql`
    type Foo {
      ids: [ID]!
    }
  `

  return <Code language="typescript" value={gents(schema).trim()} />
}

export function Functions() {
  const schema = gql`
    type Foo {
      foo(bar: String): Boolean
    }
  `

  return <Code language="typescript" value={gents(schema).trim()} />
}
