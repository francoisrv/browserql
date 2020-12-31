import * as React from 'react'
import { buildState } from '@browserql/state'
import gql from 'graphql-tag'

export function Example() {
  const schema = gql`
    type State @state {
      counter: Int! @default(value: 100)
    }
  `
  const { context } = buildState(schema)
  console.log(context.state.get('State.counter'))
  return <div>Hello</div>
}
