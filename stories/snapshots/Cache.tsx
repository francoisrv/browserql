import * as React from 'react'
import cacheql from '@browserql/cache'
import gql from 'graphql-tag'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'
import { buildQuery } from '@browserql/operations'
import Code from '../components/Code'

export function GetExample() {
  const schema = gql`
    directive @default(value: Int!) on FIELD_DEFINITION
    type Query {
      getCounter: Int! @default(value: 100)
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

export function GetQueryExample() {
  const schema = gql`
    type Query {
      getCounter: Int!
    }
  `
  function getCounter() {
    return 75
  }
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cached = cacheql(cache, schema)
    const value = cached.get(buildQuery(schema, 'getCounter'))
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema} queries={{ getCounter }}>
      <Inner />
    </BrowserqlProvider>
  )
}

export function GetNonNullEmpty() {
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

export function GetNullEmpty() {
  const schema = gql`
    type Query {
      getCounter: Int
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

export function GetDefault() {
  const schema = gql`
    directive @default(value: Int!) on FIELD_DEFINITION
    type Query {
      getCounter: Int @default(value: 100)
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
