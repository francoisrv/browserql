import React from 'react'
import TryCache from '@browserql/components/tryit/Cache'

export default function TryIt() {
  const schema = `type Query {
  getScore: Int
}`

  const query = `{
  getScore
}`

  return <TryCache initialSchema={schema} initialQuery={query} />
}

TryIt.height = 1000
