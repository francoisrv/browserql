import * as React from 'react'
import gql from 'graphql-tag'
import {
  getArgument,
  getDirective,
  getField,
  getName,
  getType,
  getTypes,
  group,
  merge,
} from '@browserql/fpql'
import { print } from 'graphql'
import type { ObjectTypeDefinitionNode } from 'graphql'

import Code from '../components/Code'
import fp from '@browserql/fp'

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

export function Group() {
  const schema = gql`
    type Query {
      a: Int
    }

    extend type Query {
      b: Int
    }
  `

  return <Code language="graphql" value={print(group(schema))} />
}
