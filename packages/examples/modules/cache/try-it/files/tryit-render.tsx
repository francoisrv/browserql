import React from 'react'
import TryCache from '@browserql/components/tryit/Cache'

export default function TryIt() {
  const schema = `type Query {
  getCounter: Int @default(value: 10)
  isLoggedIn: Boolean @default(value: false)
}

directive @default(value: Int) on FIELD_DEFINITION
`

  const query = `query GetCounter {
  getCounter
}`

  return <TryCache initialSchema={schema} initialQuery={query} />
}

TryIt.height = 1000
