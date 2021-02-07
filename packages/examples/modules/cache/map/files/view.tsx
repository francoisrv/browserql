import React from 'react'
import TryCache from '@browserql/components/tryit/Cache'

export default function TryIt() {
  const schema = `type Query {
    getScores: [Int!] @default(value: [])
  }
  
  directive @default(value: Int) on FIELD_DEFINITION`

  const query = '{ getScores }'

  return <TryCache initialSchema={schema} initialQuery={query} />
}

TryIt.height = 1000
