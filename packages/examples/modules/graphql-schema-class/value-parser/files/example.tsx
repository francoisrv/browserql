import Code from '@browserql/components/Code'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import React, { useCallback, useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { parseGraphqlValue } from '@browserql/graphql-schema-class'
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
import { parseKind } from '@browserql/fpql'

export default function Example() {
  const [schema, setSchema] = useState(`
type Foo {
  a: String!
  bar: Bar
}

type Bar {
  b: Int!
}
`)
  const [parsed, setParsed] = useState<any>(null)
  const [error, setError] = useState<Error | undefined>()
  const [kind, setKind] = useState('String')
  const [value, setValue] = useState(null)

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
      const parsedKind = parseKind(kind)
      setParsed(parseGraphqlValue(value, parseKind(kind), node))
    } catch (err) {
      setError(err)
    }
  }, [value, kind, schema])

  const handleEdit = useCallback((a) => {
    if (a.name === 'kind') {
      setKind(a.new_value)
    } else if (a.name === 'value') {
      setValue(a.new_value)
    }
  }, [])

  useEffect(handleSubmit, [value, kind, schema])

  return (
    <div>
      <div style={{ padding: 12 }}>
        <ReactJson
          src={{ kind, value }}
          theme="monokai"
          style={{ padding: 16, fontSize: 16, borderRadius: 8 }}
          name="Edit these fields"
          onEdit={handleEdit}
        />
        <div style={{ height: 25 }} />
        <ReactJson
          src={{ result: parsed }}
          theme="monokai"
          style={{ padding: 16, fontSize: 16, borderRadius: 8 }}
          name="And check result here"
        />
      </div>
      <Accordion>
        <AccordionSummary>
          <Typography variant="h6">GraphQL schema</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ padding: 12, flex: 1 }}>
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
        </AccordionDetails>
      </Accordion>
      {Boolean(error) && <Typography>ERROR: {error.message}</Typography>}
    </div>
  )
}

Example.height = 1670
