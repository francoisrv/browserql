import Code from '@browserql/components/Code'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useCallback, useState } from 'react'
import cacheql from '@browserql/cache'
import connect from '@browserql/client'
import { parse } from 'graphql'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

enum CacheOp {
  get = 'get',
  set = 'set',
  map = 'map',
}

interface Props {
  initialSchema: string
  initialQuery: string
}

export default function TryCache({ initialSchema, initialQuery }: Props) {
  const [schema, setSchema] = useState(initialSchema)
  const [query, setQuery] = useState(initialQuery)
  const [result, setResult] = useState(null)
  const [operation, setOperation] = useState<CacheOp>(CacheOp.get)

  const handleSubmit = useCallback(() => {
    const doc = parse(schema)
    const client = connect(doc)
    const cached = cacheql(client.cache, doc)
    console.log({ operation })
    switch (operation) {
      case CacheOp.get:
        setResult(cached.get(parse(query)))
        break
      case CacheOp.set:
        {
          console.log(0)
          cached.set(
            parse(query),
            {},
            {
              getCounter: 100,
              isLoggedIn: true,
            }
          )
          setResult(cached.get(parse(query)))
        }
        break
    }
  }, [schema, query, operation])

  return (
    <div>
      <Typography variant="h5">Schema</Typography>
      <Typography>Enter here your GraphQL schema with queries.</Typography>
      <div style={{ height: 15 }} />
      <TextField
        multiline
        fullWidth
        value={schema}
        onChange={(e) => setSchema(e.target.value)}
        variant="filled"
      />
      <div style={{ height: 15 }} />
      <Typography variant="h5">Operation</Typography>
      <div style={{ height: 15 }} />
      <Select
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
        fullWidth
      >
        <MenuItem value={CacheOp.get}>{CacheOp.get}</MenuItem>
        <MenuItem value={CacheOp.map}>{CacheOp.map}</MenuItem>
        <MenuItem value={CacheOp.set}>{CacheOp.set}</MenuItem>
      </Select>
      <div style={{ height: 15 }} />
      <Typography variant="h5">Query</Typography>
      <div style={{ height: 15 }} />
      <TextField
        multiline
        fullWidth
        value={query}
        variant="filled"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{ height: 15 }} />
      <Button
        color="primary"
        onClick={handleSubmit}
        variant="contained"
        fullWidth
      >
        submit
      </Button>

      <Typography variant="h5">Result</Typography>
      <Code language="json" value={JSON.stringify(result, null, 2)} />
    </div>
  )
}
