import Code from '@browserql/components/Code'
import TextField from '@material-ui/core/TextField'
import React, { useCallback, useEffect, useState } from 'react'
import {
  applyDefaults,
  getSchemaDefinition,
} from '@browserql/graphql-schema-class'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'
import { DocumentNode } from 'graphql'
import { getFields } from '@browserql/fpql'

export default function Example() {
  const [schema, setSchema] = useState(`type Foo {
  a: String!
  b: String
  c: String @default(value: "hello")
}`)
  const [result, setResult] = useState({ foo: null, name: 'me' })
  const [error, setError] = useState<Error | undefined>()

  const handleSubmit = useCallback(() => {
    setError(undefined)
    let node: DocumentNode
    try {
      try {
        node = gql(schema)
      } catch (err) {
        err.message = `Invalid GraphQLSchema: ${err.message}`
        throw err
      }
      const definition = getSchemaDefinition(node, {})
      const fields = getFields(definition)
      const values = applyDefaults(fields, {})
      setResult(values)
    } catch (err) {
      setError(err)
    }
  }, [schema])

  useEffect(handleSubmit, [schema])

  return (
    <div>
      <Typography variant="h5">GraphQL Schema</Typography>
      <div style={{ padding: 12 }}>
        <TextField
          multiline
          value={schema}
          fullWidth
          onChange={(e) => {
            setSchema(e.target.value)
          }}
          variant="filled"
        />
      </div>
      <Typography variant="h5">Default values</Typography>
      {Boolean(error) && <Typography>ERROR: {error.message}</Typography>}
      {!error && (
        <Code language="json" value={JSON.stringify(result, null, 2)} />
      )}
    </div>
  )
}

Example.height = 1670
