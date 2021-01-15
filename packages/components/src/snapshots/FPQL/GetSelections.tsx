import * as React from 'react'
import gql from 'graphql-tag'
import Code from '../../components/Code'
import fp from '@browserql/fp'
import { getArguments, getQuery } from '@browserql/fpql'

export default function GetSelections() {
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
