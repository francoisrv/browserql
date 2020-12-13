import * as React from 'react'
import gql from 'graphql-tag'
import { buildFragment } from '@browserql/fragments'
import Code from '../components/Code'

const schema = gql`
  type Post {
    title: String!
    author: Author!
  }

  type Author {
    name: String!
    email: String
  }
`

export default function FragmentsSelectExample() {
  const fragment = buildFragment(schema, 'Post', { select: ['title'] })
  return <Code language="graphql" value={fragment} />
}
