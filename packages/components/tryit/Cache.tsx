import Code from '@browserql/components/Code'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import cacheql from '@browserql/cache'
import connect from '@browserql/client'
import { parse } from 'graphql'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import SchemaComposer from '@browserql/schema-composer'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import CodeMirror from 'codemirror'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/lint/lint'
import 'codemirror-graphql/hint'
import 'codemirror-graphql/lint'
import 'codemirror-graphql/mode'

enum CacheOp {
  get = 'get',
  set = 'set',
}

interface Props {
  initialSchema: string
  initialQuery: string
  initialTab?: number
}

export default function TryCache({
  initialSchema,
  initialQuery,
  initialTab,
}: Props) {
  const [schema, setSchema] = useState(initialSchema)
  const [query, setQuery] = useState(initialQuery)
  const [result, setResult] = useState(null)
  const [operation, setOperation] = useState<CacheOp>(CacheOp.get)
  const [tab, setTab] = useState(initialTab)
  const ref = useRef<HTMLTextAreaElement>(null)

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

  useEffect(() => {
    const elem = ref.current
    if (elem) {
      const un = setTimeout(() => {
        console.log('CODE MIRROR')
        const editor = CodeMirror.fromTextArea(elem, {
          // mode: 'graphql',
          value: '{ getCounter }',
          tabSize: 4,
          mode: 'text/plain',
          theme: 'default',
          lineNumbers: true,
          styleActiveSelected: true,
          styleActiveLine: true,
          indentWithTabs: true,
          matchBrackets: true,
          highlightMatches: true,
          // lint: {
          //   schema: parse(schema),
          //   validationRules: [],
          // },
          // hintOptions: {
          //   schema: parse(schema),
          // },
        })
        console.log({ editor })
      })
      return () => clearTimeout(un)
    }
  }, [tab])

  useEffect(handleSubmit, [])

  return (
    <div>
      <link rel="stylesheet" href="//codemirror.net/doc/docs.css" />
      <link rel="stylesheet" href="//codemirror.net/lib/codemirror.css" />
      <link rel="stylesheet" href="//codemirror.net/theme/night.css" />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <Typography style={{ paddingRight: 8 }}>Cache operation:</Typography>
        <div style={{ flex: 1 }}>
          <Select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value={CacheOp.get}>{CacheOp.get}</MenuItem>
            <MenuItem value={CacheOp.set}>{CacheOp.set}</MenuItem>
          </Select>
        </div>
      </div>
      <Tabs
        value={tab}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, value) => setTab(value)}
      >
        <Tab label="Edit" />
        <Tab label="Preview" />
      </Tabs>
      <div style={{ height: 799, overflow: 'auto' }}>
        {tab === 0 && (
          <div>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Tabs variant="fullWidth">
              <Tab label="Schema" />
              <Tab label="Query" />
            </Tabs>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <SchemaComposer schema={parse(schema)} onChange={setSchema} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <textarea ref={ref} value={query}></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 1 && (
          <div>
            <Tabs variant="fullWidth" disabled>
              <Tab label="Code" />
              <Tab label="Result" />
            </Tabs>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <Code
                  language="javascript"
                  value={`import cacheql from '@browserql/cache'
import connect from '@browserql/connect'
import gql from 'graphql-tag'

const schema = gql\`
${schema.trim()}
\`

const query = gql\`
${query}
\`

const { cache } = connect(schema)

export default cacheql(cache, schema).get(query)`}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Code language="json" value={JSON.stringify(result, null, 2)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

TryCache.defaultProps = {
  initialTab: 1,
}
