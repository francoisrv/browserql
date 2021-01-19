import * as React from 'react'
import gql from 'graphql-tag'
import { print } from 'graphql'

import TabNav from '../../TabNav'
import Code from '../../Code'
import fp from '@browserql/fp'
import { getArguments, getDirective, getQuery, getType } from '@browserql/fpql'

export default function GetDirectiveArguments() {
  const schema = gql`
    type User @model(collection: "users") {
      email: EmailAddress!
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(
        fp(schema)(getType('User'), getDirective('model'), getArguments),
        null,
        2
      )}
    />
  )
}
