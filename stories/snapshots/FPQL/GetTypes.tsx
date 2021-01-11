import * as React from 'react'
import gql from 'graphql-tag'
import Code from '../../components/Code'
import { getName, getTypes } from '@browserql/fpql'

export default function GetTypes() {
  const schema = gql`
    type A {
      id: ID
    }

    type B {
      id: ID
    }
  `

  return (
    <Code
      language="json"
      value={JSON.stringify(getTypes(schema).map(getName))}
    />
  )
}
