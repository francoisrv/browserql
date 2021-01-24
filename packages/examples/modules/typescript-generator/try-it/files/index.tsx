import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import gents, { NULL_STRATEGY } from '@browserql/typescript-generator'
import gql from 'graphql-tag'
import Code from '../Code'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function TryIt() {
  const [graphqlCode, setGraphqlCode] = useState(`type User {
  name: String!
  age: Int
  id: ID!
}
  `)
  const [tsCode, setTsCode] = useState(`interface User {
  name: string
  age: number | null
  id: string | number
}
  `)
  const [useExport, setUseExport] = useState(false)
  const [useDeclare, setUseDeclare] = useState(false)
  const [ID, setID] = useState('string | number')
  const [nullStrategy, setNullStrategy] = useState<NULL_STRATEGY[]>([
    NULL_STRATEGY.null,
  ])
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    try {
      setError(undefined)
      setTsCode(
        gents(gql(graphqlCode), {
          useExport,
          useDeclare,
          ID,
          null: nullStrategy,
        })
      )
    } catch (error) {
      setError(error)
    }
  }, [useExport, graphqlCode, useDeclare, ID, nullStrategy])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setGraphqlCode(value)
  }

  const handleUseExport = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUseExport(!useExport)
    },
    [useExport]
  )

  const handleUseDeclare = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUseDeclare(!useDeclare)
    },
    [useDeclare]
  )

  const handleID = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setID(e.target.value)
  }, [])

  const handleNull = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setNullStrategy((e.target.value as unknown) as NULL_STRATEGY[])
  }, [])

  console.log({ nullStrategy })

  return (
    <div style={{ padding: 16 }}>
      <Accordion
        elevation={0}
        defaultExpanded
        style={{ marginBottom: 22, borderBottom: '1px solid #eee' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper
            style={{ padding: 12, backgroundColor: '#eee', flex: 1 }}
            elevation={0}
          >
            <FormGroup row style={{ justifyContent: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useExport}
                    onChange={handleUseExport}
                    color="primary"
                  />
                }
                label="Use export"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={useDeclare}
                    onChange={handleUseDeclare}
                    color="primary"
                  />
                }
                label="Use declare"
              />
              <TextField
                id="outlined-basic"
                label="ID"
                variant="outlined"
                value={ID}
                style={{ width: 150 }}
                onChange={handleID}
              />
              <FormControl variant="filled" style={{ marginLeft: 12 }}>
                <InputLabel id="demo-simple-select-filled-label">
                  Nullable
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={nullStrategy}
                  onChange={handleNull}
                  multiple
                >
                  <MenuItem value="null">null</MenuItem>
                  <MenuItem value="undefined">undefined</MenuItem>
                  <MenuItem value="missing">missing</MenuItem>
                </Select>
              </FormControl>
            </FormGroup>
          </Paper>
        </AccordionDetails>
      </Accordion>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1 }}>
          <Typography variant="h5">GraphQL input</Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography variant="h5" align="right">
            Typescript output
          </Typography>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <TextField
            multiline
            fullWidth
            rows={20}
            value={graphqlCode}
            onChange={handleChange}
            variant="filled"
            InputProps={{
              style: {
                fontWeight: 'bold',
              },
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            border: '2px solid #ddd',
            borderRadius: 6,
            padding: 8,
          }}
        >
          {error && (
            <div>
              <Typography>{error.message}</Typography>
            </div>
          )}
          {!error && <pre>{tsCode}</pre>}
        </div>
      </div>
    </div>
  )
}

TryIt.height = 800
