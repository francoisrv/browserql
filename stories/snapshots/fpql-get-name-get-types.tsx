import * as React from 'react'
import gql from 'graphql-tag'
import { getName, getTypes } from '@browserql/fpql'

import Code from '../components/Code'

const schema = gql`
  type A {
    id: ID!
  }
`

export default function FPQLGetNameGetTypes() {
  return (
    <Code
      language="json"
      value={JSON.stringify(getTypes(schema).map(getName))}
    />
  )
}
