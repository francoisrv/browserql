import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const SCHEMA = gql(
  readFileSync(
    'packages/examples/modules/fragments/usage/files/PostAuthor.graphql'
  ).toString()
)
