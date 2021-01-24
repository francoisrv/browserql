import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const SCHEMA = gql(
  readFileSync(
    'packages/examples/modules/fpql/getArgument/files/directive.graphql'
  ).toString()
)
