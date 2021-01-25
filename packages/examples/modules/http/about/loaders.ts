import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const schema = gql(
  readFileSync(
    'packages/examples/modules/http/about/files/schema.graphql'
  ).toString()
)
