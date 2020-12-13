import * as React from 'react'
import gql from 'graphql-tag'
import { build, showCollections } from '@browserql/firestore'
import { print, ASTNode, DocumentNode } from 'graphql'

import Code from '../components/Code'
import { firestore } from '../utils'
import { getQuery } from '@browserql/fpql'

export function ShowCollections() {
  const schema = gql`
    type A @firestore {
      name: String!
    }

    type B @firestore(collection: "collection-b") {
      name: String!
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(showCollections(schema), null, 2)}
    />
  )
}

export function GetOne() {
  const { schema } = build(
    firestore,
    gql`
      type MyCollection @firestore {
        name: String!
      }
    `
  )
  const query = getQuery('firestore_getOne_MyCollection')(
    schema as DocumentNode
  )
  return (
    <Code
      language="graphql"
      value={`
  extend type Query {
    ${print(query as ASTNode)}
  }
  `}
    />
  )
}

export function GetMany() {
  const { schema } = build(
    firestore,
    gql`
      type MyCollection @firestore {
        name: String!
      }
    `
  )
  const query = getQuery('firestore_getMany_MyCollection')(
    schema as DocumentNode
  )
  return (
    <Code
      language="graphql"
      value={`
  extend type Query {
    ${print(query as ASTNode)}
  }
  `}
    />
  )
}

export function Count() {
  const { schema } = build(
    firestore,
    gql`
      type MyCollection @firestore {
        name: String!
      }
    `
  )
  const query = getQuery('firestore_count_MyCollection')(schema as DocumentNode)
  return (
    <Code
      language="graphql"
      value={`
  extend type Query {
    ${print(query as ASTNode)}
  }
  `}
    />
  )
}

export default function Pluralize() {
  const schema = gql`
    type User @firestore {
      name: String!
    }

    type Team @firestore {
      name: String!
    }
  `

  const pluralize = (name: string) => name.toLowerCase().concat('s')
  return (
    <Code
      language="json"
      value={JSON.stringify(
        showCollections(schema, {
          namingStrategy: pluralize,
        }),
        null,
        2
      )}
    />
  )
}

export function GeneratedSchema() {
  const { schema } = build(
    firestore,
    gql`
      type Foo {
        name: String!
      }
    `
  )
  return <Code language="graphql" value={print(schema as DocumentNode)} />
}

export function Example1() {
  const schema = gql`
    type Todo @firestore {
      name: String!
      done: Boolean! @default(value: false)
      doneTime: FirestoreTimestamp
    }
  `

  return <div>hello</div>
}

export function ApiGet() {
  return <Code language="text" value="MISSING TEST" />
}
