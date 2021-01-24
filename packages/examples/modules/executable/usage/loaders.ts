import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const SCHEMA = gql(
  readFileSync(
    'packages/examples/modules/executable/usage/files/schema.graphql'
  ).toString()
)
