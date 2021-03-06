import Code from '@browserql/components/Code'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import cacheql from '@browserql/cache'
import connect from '@browserql/client'
import { buildSchema, parse } from 'graphql'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import SchemaComposer from '@browserql/schema-composer'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import CodeMirror from 'codemirror'
import ReactJson from 'react-json-view'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/lint/lint'
import 'codemirror-graphql/hint'
import 'codemirror-graphql/lint'
import 'codemirror-graphql/mode'
import { Helmet } from 'react-helmet'

enum CacheOp {
  get = 'get',
  set = 'set',
}

interface Props {
  initialSchema: string
  initialQuery: string
  initialTab?: number
}

const Links = memo(function () {
  return (
    <Helmet>
      <link rel="stylesheet" href="http://codemirror.net/doc/docs.css" />
      <link rel="stylesheet" href="http://codemirror.net/lib/codemirror.css" />
      <link rel="stylesheet" href="http://codemirror.net/theme/night.css" />
    </Helmet>
  )
})

function GraphqlExecutableSchemaEditor({
  query,
  schema,
}: {
  query: string
  schema: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [editor, setEditor] = useState<any>()
  useEffect(() => {
    if (!editor) {
      const un = setTimeout(() => {
        const elem = ref.current
        setEditor(
          CodeMirror.fromTextArea(elem, {
            mode: 'graphql',
            value: '{ getCounter }',
            tabSize: 4,
            // mode: 'text/plain',
            theme: 'default',
            lineNumbers: true,
            styleActiveSelected: true,
            styleActiveLine: true,
            indentWithTabs: true,
            matchBrackets: true,
            highlightMatches: true,
            lint: {
              schema: buildSchema(schema),
              validationRules: [],
            },
            hintOptions: {
              schema: buildSchema(schema),
            },
          })
        )
      })
      return () => clearTimeout(un)
    }
  }, [editor])
  return (
    <div style={{ position: 'relative' }}>
      <textarea ref={ref} defaultValue={query}></textarea>
    </div>
  )
}

function getCache(schema: string) {
  const doc = parse(schema)
  const client = connect(doc)
  return cacheql(client.cache, doc)
}

export default function TryCache({
  initialSchema,
  initialQuery,
  initialTab,
}: Props) {
  const [schema, setSchema] = useState(initialSchema)
  const [tmpSchema, setTmpSchema] = useState(initialSchema)
  const [query, setQuery] = useState(initialQuery)
  const [tmpQuery, setTmpQuery] = useState(initialQuery)
  const [variables, setVariables] = useState<any>({})
  const [setter, setSetter] = useState(
    JSON.stringify(
      {
        variables: {},
        data: {
          getPostMessage: {
            message: 'foo',
            data: { foo: 1, __typename: 'Data' },
            __typename: 'Message',
          },
        },
      },
      null,
      2
    )
  )
  const [cacheQL, setCacheQL] = useState<any>(getCache(schema))
  const handleSave = useCallback(() => {
    setSchema(tmpSchema)
    setQuery(tmpQuery)
  }, [tmpSchema, tmpQuery])
  const handleSet = useCallback(() => {
    try {
      const parsed = JSON.parse(setter)
      console.log('trying')
      cacheQL.set(parse(query), parsed.variables, parsed.data)
      setSetter(setter.concat('\n'))
    } catch (error) {
      console.log(error)
    }
  }, [setter, schema, query, cacheQL])
  useEffect(() => {
    setCacheQL(getCache(schema))
  }, [schema])
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ height: 12 }} />
        <TextField
          multiline
          value={tmpSchema}
          onChange={(event) => setTmpSchema(event.target.value)}
          fullWidth
          label="Schema"
          rowsMax={30}
          variant="outlined"
        />
        <div style={{ height: 12 }} />
        <TextField
          multiline
          value={tmpQuery}
          onChange={(event) => setTmpQuery(event.target.value)}
          fullWidth
          label="Query"
          rowsMax={20}
          variant="outlined"
        />
        <div style={{ height: 12 }} />
        <Button fullWidth onClick={handleSave}>
          Save
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Code
          language="json"
          value={JSON.stringify(cacheQL.get(parse(query), variables), null, 2)}
        />
        <div style={{ height: 12 }} />
        <TextField
          multiline
          value={setter}
          onChange={(event) => setSetter(event.target.value)}
          fullWidth
          label="Set"
          rowsMax={25}
          variant="outlined"
        />
        <div style={{ height: 12 }} />
        <Button fullWidth onClick={handleSet}>
          Set
        </Button>
      </div>
    </div>
  )
}

export function TryCache2({ initialSchema, initialQuery, initialTab }: Props) {
  const [schema, setSchema] = useState(initialSchema)
  const [query, setQuery] = useState(initialQuery)
  const [result, setResult] = useState(null)
  const [operation, setOperation] = useState<CacheOp>(CacheOp.get)
  const [tab, setTab] = useState(initialTab)
  const [variables, setVariables] = useState<any>({})

  const handleSubmit = useCallback(() => {
    const doc = parse(schema)
    const client = connect(doc)
    const cached = cacheql(client.cache, doc)
    switch (operation) {
      case CacheOp.get:
        setResult(cached.get(parse(query), variables))
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
  }, [schema, query, operation, variables])

  useEffect(handleSubmit, [])

  return (
    <div>
      <Links />
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
              style={{ marginTop: 10 }}
            >
              Save
            </Button>
            <Tabs variant="fullWidth" value={0}>
              <Tab label="Schema" />
              <Tab label="Query" />
            </Tabs>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <SchemaComposer schema={parse(schema)} onChange={setSchema} />
              </div>
              <div style={{ flex: 1 }}>
                <GraphqlExecutableSchemaEditor query={query} schema={schema} />
                <Tabs variant="fullWidth" value={0}>
                  <Tab label="Variables" />
                </Tabs>
                <ReactJson
                  src={variables}
                  theme="monokai"
                  onAdd={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  style={{ padding: 16, fontSize: 16, borderRadius: 8 }}
                  name="Candidate"
                />
              </div>
            </div>
          </div>
        )}
        {tab === 1 && (
          <div>
            <Tabs variant="fullWidth" disabled value={0}>
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
