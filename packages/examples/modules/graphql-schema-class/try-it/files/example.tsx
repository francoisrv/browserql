import Code from '@browserql/components/Code'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import React, { useCallback, useState } from 'react'
import ReactJson from 'react-json-view'
import { GraphqlSchemaClass } from '@browserql/graphql-schema-class'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'
import { DocumentNode } from 'graphql'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import { ExpandMore } from '@material-ui/icons'
import AccordionDetails from '@material-ui/core/AccordionDetails'

export default function Example() {
  const [object, setObject] = useState({ name: 'me' })
  const [schema, setSchema] = useState(`type User {
  name: String !
  foo: JSON
}`)
  const [result, setResult] = useState({ name: 'me' })
  const [error, setError] = useState<Error | undefined>()

  const handleAdd = (a: any) => setObject(a.updated_src)
  const handleDelete = (a: any) => setObject(a.updated_src)
  const handleEdit = (a: any) => setObject(a.updated_src)

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
      const Model = class extends GraphqlSchemaClass<any> {
        static schema = node
      }
      const model = new Model(object)
      setResult(model.toJSON())
    } catch (err) {
      setError(err)
    }
  }, [object, schema])

  return (
    <div>
      <Typography variant="h5">GraphQL Schema</Typography>
      <div style={{ padding: 12 }}>
        <TextField
          multiline
          value={schema}
          fullWidth
          onChange={(e) => setSchema(e.target.value)}
          variant="filled"
        />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>More options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">Scalars</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <Typography variant="h5">Candidate</Typography>
      <div style={{ padding: 12 }}>
        <ReactJson
          src={object}
          theme="monokai"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          style={{ padding: 16 }}
          name="Candidate"
        />
      </div>
      <Button
        fullWidth
        color="primary"
        onClick={handleSubmit}
        variant="contained"
      >
        Instantiate schema with candidate
      </Button>
      {Boolean(error) && <Typography>ERROR: {error.message}</Typography>}
      {!error && (
        <Code language="json" value={JSON.stringify(result, null, 2)} />
      )}
    </div>
  )
}

Example.height = 1000
