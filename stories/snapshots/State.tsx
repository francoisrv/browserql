import * as React from 'react'
import { stateql } from '@browserql/state'
import gql from 'graphql-tag'

export function Example() {
  const schema = gql`
    type State @state {
      counter: Int! @default(value: 100)
    }
  `
  const { get } = stateql(schema)
  console.log(get('State.counter'))
  return <div>Hello</div>
}
