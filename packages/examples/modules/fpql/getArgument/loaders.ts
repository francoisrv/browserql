import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const SCHEMA = gql(
  readFileSync(
    'packages/examples/modules/fpql/getArgument/files/directive.graphql'
  ).toString()
)

export const MY_SCHEMA = gql(
  readFileSync(
    'packages/examples/modules/fpql/getArgument/files/query.graphql'
  ).toString()
)

export const GRAPHQL = gql(
  readFileSync(
    'packages/examples/modules/fpql/getArgument/files/field.graphql'
  ).toString()
)
