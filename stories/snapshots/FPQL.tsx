import * as React from 'react'
import gql from 'graphql-tag'
import {
  getArgument,
  getDefaultValue,
  getDirective,
  getExecutableQueries,
  getField,
  getKind,
  getName,
  getQuery,
  getScalar,
  getScalars,
  getType,
  getTypes,
  getValue,
  merge,
} from '@browserql/fpql'
import { print } from 'graphql'
import type { ObjectTypeDefinitionNode } from 'graphql'
import fp from '@browserql/fp'

import Code from '../components/Code'

export function GetTypes() {
  const schema = gql`
    type A {
      id: ID
    }

    type B {
      id: ID
    }
  `

  return (
    <Code
      language="json"
      value={JSON.stringify(getTypes(schema).map(getName))}
    />
  )
}

export function GetTypesNames() {
  const schema = gql`
    type A {
      id: ID!
    }
  `

  return (
    <Code
      language="json"
      value={JSON.stringify(getTypes(schema).map(getName))}
    />
  )
}

export function GetDirectiveArgument() {
  const schema = gql`
    type A @foo(bar: 24) {
      id: ID!
    }
  `

  const type = getType('A')(schema)
  const directive = getDirective('foo')(type as ObjectTypeDefinitionNode)
  const arg = getArgument('bar')(directive)

  return <Code language="json" value={JSON.stringify(arg, null, 2)} />
}

export function MergeExtendExistingTypes() {
  const A = gql`
    type Query {
      id: ID
    }
  `

  const B = gql`
    type Query {
      foo: ID
    }
  `

  return <Code language="graphql" value={print(merge(A, B))} />
}

export function MergeRemoveExtension() {
  const schema = gql`
    extend type Query {
      id: ID
    }
  `

  return <Code language="graphql" value={print(merge(schema))} />
}

export function Example() {
  const schema = gql`
    type MyType {
      myField: String!
        @myDirective(a: 24, b: "hello", c: false, d: 245.76, e: [24])
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(
        fp(schema)(
          getType('MyType'),
          getField('myField'),
          getDirective('myDirective'),
          (directive) => ({
            a: fp(directive)(getArgument('a'), getValue),
            b: fp(directive)(getArgument('b'), getValue),
            c: fp(directive)(getArgument('c'), getValue),
            d: fp(directive)(getArgument('d'), getValue),
            e: fp(directive)(getArgument('e'), getValue),
          })
        ),
        null,
        2
      )}
    />
  )
}

export function GetScalars() {
  const schema = gql`
    scalar EmailAddress

    type User {
      email: EmailAddress
    }
  `
  return (
    <Code language="json" value={JSON.stringify(getScalars(schema), null, 2)} />
  )
}

export function GetScalar() {
  const schema = gql`
    scalar EmailAddress

    type User {
      email: EmailAddress
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(getScalar('EmailAddress')(schema), null, 2)}
    />
  )
}

export function WithQueryExample() {
  const schema = gql`
    query {
      query1

      query2
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(getExecutableQueries(schema).map(getName), null, 2)}
    />
  )
}

export function GetValue() {
  const schema = gql`
    type Query {
      getUser: User! @variant(admin: true)
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(
        fp(schema)(
          getQuery('getUser'),
          getDirective('variant'),
          getArgument('admin'),
          getValue
        ),
        null,
        2
      )}
    />
  )
}

export function GetObjectValue() {
  const schema = gql`
    type Query {
      getUser: User! @variant(admin: { level: 2 })
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(
        fp(schema)(
          getQuery('getUser'),
          getDirective('variant'),
          getArgument('admin'),
          getValue
        ),
        null,
        2
      )}
    />
  )
}

export function GetDefaultValue() {
  const schema = gql`
    type Query {
      get(flag: Boolean = false): Boolean
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(
        fp(schema)(getQuery('get'), getArgument('flag'), getDefaultValue),
        null,
        2
      )}
    />
  )
}

export function GetFieldKind() {
  const schema = gql`
    type Query {
      getUser(id: ID!, includeSettings: Boolean = false): User
    }
  `
  return (
    <Code language="text" value={fp(schema)(getQuery('getUser'), getKind)} />
  )
}

export function GetArgumentKind() {
  const schema = gql`
    type Query {
      getUser(id: ID!, includeSettings: Boolean = false): User
    }
  `
  return (
    <Code
      language="text"
      value={fp(schema)(
        getQuery('getUser'),
        getArgument('includeSettings'),
        getKind
      )}
    />
  )
}
