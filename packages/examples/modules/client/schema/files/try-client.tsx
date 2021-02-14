import TryClient from '@browserql/components/tryit/Client'
import React from 'react'
import { DateResolver as Date } from 'graphql-scalars'
import connect from '@browserql/client'

export default function View() {
  return (
    <TryClient
      schema={`type Query {
  whatTimeIsIt: Date!
}
scalar Date`}
      query="{ whatTimeIsIt }"
      scalars="export { DateResolver as Date } from 'graphql-scalars'"
      queries={`export function whatTimeIsIt() {
  return new Date()
}`}
      client={connect}
    />
  )
}

View.height = 1990
