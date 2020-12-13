import * as React from 'react'
import gql from 'graphql-tag'
import Code from '../components/Code'
import { showCollections } from '@browserql/firestore'

const schema = gql`
  type User @firestore {
    name: String!
  }

  type Team @firestore {
    name: String!
  }
`

const pluralize = (name: string) => name.toLowerCase().concat('s')

export default function FirestorePluralize() {
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
