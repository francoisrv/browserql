import React, { ReactElement } from 'react'
import { DefinitionNode, DocumentNode, print } from 'graphql'
import Code from '@browserql/components/Code'
import State from '@browserql/state-react'
import cacheql from '@browserql/cache'
import gql from 'graphql-tag'
import { getName } from '@browserql/fpql'
import { BrowserqlProvider, UseQuery } from '@browserql/react'
import DefinitionCard from './components/DefinitionCard'
import Definitions from './components/Definitions'
import { GET_DEFINITIONS, PRINT_SCHEMA } from './queries'
import Preview from './components/Preview'

interface Props {
  schema: DocumentNode
}

let id = 0

function findDefinitionKind(definition: DefinitionNode) {
  switch (definition.kind) {
    case 'ObjectTypeDefinition':
    case 'ObjectTypeExtension':
      return 'type'
  }
}

const makeBaseSchema = (definitions: readonly DefinitionNode[]) => gql`
  scalar JSON

  directive @default(value: JSON) on FIELD_DEFINITION

  enum DefinitionKind {
    type
  }

  type Definition {
    id: ID!
    name: String!
    kind: String!
  }

  type Field {
    id: ID!
    name:String!
  }

  type Query {
    getDefinitions: [Definition!]! @default(value: [
      ${definitions
        .map(
          (def) => `{
        name: "${getName(def)}"
        kind: "${findDefinitionKind(def)}"
        id: ${id++}
      }`
        )
        .join('\n  ')}
    ])

    getFields: [Field!]!

    printSchema: String!
  }
`

function printSchema(_variables: any, ctx: any) {
  const { schema, cache } = ctx.browserqlClient
  const cached = cacheql(cache, schema)
  const definitions = cached.get(GET_DEFINITIONS)
  return definitions.getDefinitions
    .map((def) => `${def.kind} ${def.name}`)
    .join('\n')
}

export default function SchemaComposer({ schema }: Props) {
  const baseSchema = makeBaseSchema(schema.definitions)
  console.log(print(baseSchema))
  return (
    <div style={{ padding: 16, backgroundColor: '#333' }}>
      <BrowserqlProvider schema={baseSchema}>
        <Definitions />
        <Preview />
      </BrowserqlProvider>
    </div>
  )
}
