import * as React from 'react'
import gql from 'graphql-tag'
import Code from '../../Code'
import fp from '@browserql/fp'
import { getArguments, getExecutableOperation } from '@browserql/fpql'

export default function GetExecutableOperationArguments() {
  const schema = gql`
    query Get($page: Int = 1) {
      get(page: $page)
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(
        fp(schema)(getExecutableOperation('Get'), getArguments),
        null,
        2
      )}
    />
  )
}
