import React, { useState } from 'react'
import SchemaComposer from '@browserql/schema-composer'
import Select from '@material-ui/core/Select'
import { getName, getQueries } from '@browserql/fpql'
import { parse } from 'graphql'
import MenuItem from '@material-ui/core/MenuItem'
import Code from '@browserql/components/Code'
import { printExecutableQuery } from '@browserql/executable'

const SCHEMA = `type Query {
  getUserById(id: ID!): User
}
`

export default function View() {
  const [schema, setSchema] = useState(SCHEMA)
  const [selectedQueries, setSelectedQueries] = useState<string[]>([])
  const queries = getQueries(parse(schema))
  return (
    <div>
      <SchemaComposer schema={schema} onChange={setSchema} />
      <div>
        <Select
          multiple
          value={selectedQueries}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
            setSelectedQueries(event.target.value as string[])
          }
        >
          {queries.map((query) => (
            <MenuItem key={getName(query)} value={getName(query)}>
              {getName(query)}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Code
        language="graphql"
        value={printExecutableQuery(parse(schema), selectedQueries[0])}
      />
    </div>
  )
}

View.height = 500
