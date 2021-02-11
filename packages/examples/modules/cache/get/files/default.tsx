import React from 'react'
import TryCache from '@browserql/components/tryit/Cache'

export default function TryIt() {
  const schema = `type Query {
  getScore: Int @default(value: 10)
}

directive @default(value: Int!) on FIELD_DEFINITION`

  const query = `{
  getScore
}`

  return <TryCache initialSchema={schema} initialQuery={query} initialTab={1} />
}

TryIt.height = 700
