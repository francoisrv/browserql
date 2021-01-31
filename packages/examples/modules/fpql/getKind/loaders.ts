import { readFileSync } from 'fs'
import gql from 'graphql-tag'

export const schema1 = gql(
  readFileSync(
    'packages/examples/modules/fpql/getKind/files/schema-get-query-kind.graphql'
  ).toString()
)
