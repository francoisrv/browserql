import React from 'react'
import TryCache from '@browserql/components/tryit/Cache'

export default function TryIt() {
  const schema = `type Query {
  getCounter: Int @default(value: 10)
  isLoggedIn: Boolean @default(value: false)
  getPostMessage: Message!
}

type Message {
    message: String!
    data: Data!
}

type Data {
  foo: Int!
}

input DataInput {
  foo: Int!
}

directive @default(value: Int) on FIELD_DEFINITION
  
`

  const query = `query GetCounter {
  getPostMessage {
    message
    data {
        foo
    }
  }
}
`

  return <TryCache initialSchema={schema} initialQuery={query} />
}

TryIt.height = 1000
