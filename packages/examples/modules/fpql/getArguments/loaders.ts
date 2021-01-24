import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const FIELDS = gql(
  readFileSync(
    'packages/examples/modules/fpql/getArguments/files/fields.graphql'
  ).toString()
)

export const DIRECTIVES = gql(
  readFileSync(
    'packages/examples/modules/fpql/getArguments/files/directive.graphql'
  ).toString()
)

export const QUERY = gql(
  readFileSync(
    'packages/examples/modules/fpql/getArguments/files/query.graphql'
  ).toString()
)
