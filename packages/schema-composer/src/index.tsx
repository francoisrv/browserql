import React from 'react'
import { DefinitionNode, DocumentNode, print } from 'graphql'
import gql from 'graphql-tag'
import { getName } from '@browserql/fpql'
import { BrowserqlProvider } from '@browserql/react'
import Definitions from './components/Definitions'
import Preview from './components/Preview'
import DefinitionCard from './components/DefinitionCard'
import config from './config'

interface Props {
  schema: DocumentNode
}

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
        id: ${config.id++}
      }`
        )
        .join('\n  ')}
    ])

    getFields: [Field!]!

    printSchema: String!
  }
`

export default function SchemaComposer({ schema }: Props) {
  const baseSchema = makeBaseSchema(schema.definitions)
  console.log(print(baseSchema))
  return (
    <div style={{ padding: 16, backgroundColor: '#333' }}>
      <BrowserqlProvider schema={baseSchema}>
        <DefinitionCard />
        <Definitions />
        <Preview />
      </BrowserqlProvider>
    </div>
  )
}
