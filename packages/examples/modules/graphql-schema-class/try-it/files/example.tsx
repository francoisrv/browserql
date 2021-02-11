import Code from '@browserql/components/Code'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import React, { useCallback, useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { GraphqlSchemaClass } from '@browserql/graphql-schema-class'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'
import { DocumentNode } from 'graphql'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import { JSONResolver } from 'graphql-scalars'
import FormControlLabel from '@material-ui/core/FormControlLabel'

export default function Example() {
  const [object, setObject] = useState({
    a: 'hello',
    bar: null,
  })
  const [schema, setSchema] = useState(`type Foo {
  a: String!
  bar: Bar
}

type Bar {
  b: Int!
}
`)
  const [result, setResult] = useState({ foo: null, name: 'me' })
  const [error, setError] = useState<Error | undefined>()
  const [ignoreExtraneousFields, setIgnoreExtraneousFields] = useState<boolean>(
    GraphqlSchemaClass.ignoreExtraneousFields
  )

  const toggleIgnoreExtraneousFields = useCallback(() => {
    setIgnoreExtraneousFields(!ignoreExtraneousFields)
  }, [ignoreExtraneousFields])

  const handleAdd = (a: any) => {
    setObject(a.updated_src)
  }
  const handleDelete = (a: any) => {
    setObject(a.updated_src)
  }
  const handleEdit = (a: any) => {
    setObject(a.updated_src)
  }

  const handleSubmit = useCallback(() => {
    console.log('H', object)
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
        static scalars = {
          JSON: JSONResolver,
        }
        static ignoreExtraneousFields = ignoreExtraneousFields
      }
      const model = new Model(object)
      setResult(model.toJSON())
    } catch (err) {
      setError(err)
    }
  }, [object, schema, ignoreExtraneousFields])

  useEffect(handleSubmit, [object, schema, ignoreExtraneousFields])

  return (
    <div>
      <Typography variant="h5">GraphQL Schema</Typography>
      <div style={{ padding: 12 }}>
        <Typography>First define your schema with GraphQL</Typography>
        <TextField
          multiline
          value={schema}
          fullWidth
          onChange={(e) => {
            setSchema(e.target.value)
          }}
          variant="filled"
        />
        <Accordion>
          <AccordionSummary>
            <Typography variant="h6">More options...</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ flex: 1 }}>
              <Typography variant="h6">Extraneous fields</Typography>
              <FormControlLabel
                label="Ignore extraneous fields"
                control={
                  <Checkbox
                    checked={ignoreExtraneousFields}
                    onChange={toggleIgnoreExtraneousFields}
                  />
                }
              />
              <Typography variant="h6">Scalars</Typography>
              <List>
                <ListItem dense button>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary="JSON" />
                </ListItem>
              </List>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <Typography variant="h5">Candidate</Typography>
      <div style={{ padding: 12 }}>
        <Typography>
          Now we're going to call the new class constructor with this object:
          (you can edit it)
        </Typography>
        <ReactJson
          src={object}
          theme="monokai"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          style={{ padding: 16, fontSize: 16, borderRadius: 8 }}
          name="Variables"
        />
      </div>
      <Typography variant="h5">Model</Typography>
      {Boolean(error) && <Typography>ERROR: {error.message}</Typography>}
      {!error && (
        <Code language="json" value={JSON.stringify(result, null, 2)} />
      )}
    </div>
  )
}

Example.height = 1670
