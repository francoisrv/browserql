import * as React from 'react'
import gql from 'graphql-tag'
import { print } from 'graphql'

import TabNav from '../../components/TabNav'
import Code from '../../components/Code'
import fp from '@browserql/fp'
import { getArguments, getQuery } from '@browserql/fpql'

export default function GetFieldArguments() {
  const schema = gql`
    type Query {
      sayHello(to: String = "everybody"): String!
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(
        fp(schema)(getQuery('sayHello'), getArguments),
        null,
        2
      )}
    />
  )
}
