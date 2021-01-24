import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const SCHEMA = gql(
  readFileSync(
    'packages/examples/modules/fpql/getDirective/files/schema.graphql'
  ).toString()
)
