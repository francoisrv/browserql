import * as React from 'react'
import {
  getArgument,
  getDirective,
  getField,
  getType,
  getValue,
} from '@browserql/fpql'
import fp from '@browserql/fp'
import gql from 'graphql-tag'
import Code from '../components/Code'

console.log({ getValue })

export default function FPQLExample() {
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
