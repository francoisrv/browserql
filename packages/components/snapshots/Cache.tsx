import * as React from 'react'
import cacheql from '@browserql/cache'
import gql from 'graphql-tag'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'
import Code from '../Code'
import { makeExecutableQuery } from '@browserql/executable'

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

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
    const value = cached.get(makeExecutableQuery(schema, 'getCounter'))
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

export function GetExampleWithVariables() {
  const schema = gql`
    directive @default(value: Int!) on FIELD_DEFINITION
    type Query {
      getCounter(userID: ID!): Int
    }
  `
  const variables = { user: 1234 }
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cached = cacheql(cache, schema)
    const query = makeExecutableQuery(schema, 'getCounter')
    const value = cached.get(query, variables)
    const source = `cached.get(GET_COUNTER, { user: 1234 }) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

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
    const value = cached.get(makeExecutableQuery(schema, 'getCounter'))
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema} queries={{ getCounter }}>
      <Inner />
    </BrowserqlProvider>
  )
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

export function GetNonNullEmpty() {
  const schema = gql`
    type Query {
      getCounter: Int!
    }
  `
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cached = cacheql(cache, schema)
    const value = cached.get(makeExecutableQuery(schema, 'getCounter'))
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

export function GetNullEmpty() {
  const schema = gql`
    type Query {
      getCounter: Int
    }
  `
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cached = cacheql(cache, schema)
    const value = cached.get(makeExecutableQuery(schema, 'getCounter'))
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

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
    const value = cached.get(makeExecutableQuery(schema, 'getCounter'))
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

export function SetExampleGet() {
  const schema = gql`
    type Query {
      getCounter: Int
    }
  `
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cachedQueries = cacheql(cache, schema)
    const value = cachedQueries.get(makeExecutableQuery(schema, 'getCounter'))
    const source = `cachedQueries.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}

export function SetExampleSet() {
  const schema = gql`
    type Query {
      getCounter: Int
    }
  `
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cachedQueries = cacheql(cache, schema)
    const query = makeExecutableQuery(schema, 'getCounter')
    cachedQueries.set(query, 100)
    const value = cachedQueries.get(makeExecutableQuery(schema, 'getCounter'))
    const source = `cachedQueries.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

export function SetExampleWithVariablesGet() {
  const schema = gql`
    type Query {
      getCounter(user: ID!): Int
    }
  `
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cached = cacheql(cache, schema)
    const value = cached.get(makeExecutableQuery(schema, 'getCounter'), {
      user: 1234,
    })
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}

export function SetExampleWithVariablesSet() {
  const schema = gql`
    type Query {
      getCounter(user: ID!): Int
    }
  `
  function Inner() {
    const { cache, schema } = React.useContext(BrowserqlContext)
    const cached = cacheql(cache, schema)
    const query = makeExecutableQuery(schema, 'getCounter')
    cached.set(query, { user: 1234 }, 100)
    const value = cached.get(makeExecutableQuery(schema, 'getCounter'), {
      user: 1234,
    })
    const source = `cached.get(GET_COUNTER) // ${value}`
    return <Code language="javascript" value={source} />
  }
  return (
    <BrowserqlProvider schema={schema}>
      <Inner />
    </BrowserqlProvider>
  )
}
