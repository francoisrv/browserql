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

export function NullableWithNull() {
  const schema = gql`
    type Foo {
      bar: String
    }
  `

  return (
    <Code
      language="typescript"
      value={`
${gents(schema, { null: 'null' }).trim()}
  `}
    />
  )
}

export function NullableWithUndefined() {
  const schema = gql`
    type Foo {
      bar: String
    }
  `

  return (
    <Code
      language="typescript"
      value={`
${gents(schema, { null: 'undefined' }).trim()}
  `}
    />
  )
}

export function NullableWithMissing() {
  const schema = gql`
    type Foo {
      bar: String
    }
  `

  return (
    <Code
      language="typescript"
      value={`
${gents(schema, { null: 'missing' }).trim()}
  `}
    />
  )
}

export function NullableWithMixed() {
  const schema = gql`
    type Foo {
      bar: String
    }
  `

  return (
    <Code
      language="typescript"
      value={`
${gents(schema, { null: ['missing', 'null'] }).trim()}
  `}
    />
  )
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

export function ExtendedTypes() {
  const schema = gql`
    type User {
      name: String!
    }

    extend type User {
      email: String!
    }
  `

  return <Code language="typescript" value={gents(schema).trim()} />
}

export function Enums() {
  const schema = gql`
    enum HttpMethod {
      GET
      POST
      PUT
      DELETE
    }
  `

  return <Code language="typescript" value={gents(schema).trim()} />
}
