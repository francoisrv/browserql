import * as React from 'react'
import cacheql from '@browserql/cache'
import gql from 'graphql-tag'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'
import { buildQuery } from '@browserql/operations'
import Code from '../components/Code'

export function Get() {
  const schema = gql`
    type Query {
      getCounter: Int!
    }
  `
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cached = cacheql(cache, schema)
    const value = cached.get(buildQuery(schema, 'getCounter'))
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}
