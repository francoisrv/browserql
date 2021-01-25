import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const schema = gql(
  readFileSync(
    'packages/examples/modules/graphiql/usage/files/schema.graphql'
  ).toString()
)
