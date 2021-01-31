import React from 'react'
import type {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'
import { getFields, getName } from '@browserql/fpql'
import Typography from '@material-ui/core/Typography'
import FieldComposer from './FieldComposer'

interface Props {
  type: ObjectTypeDefinitionNode | ObjectTypeExtensionNode
}

export default function TypeComposer({ type }: Props) {
  const fields = getFields(type) as FieldDefinitionNode[]
  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Typography>type</Typography>
        <Typography>{getName(type)}</Typography>
        <Typography>{'{'}</Typography>
      </div>
      <div style={{ padding: 16 }}>
        {fields.map((field) => (
          <FieldComposer field={field} key={getName(field)} />
        ))}
      </div>
      <div>
        <Typography>{'}'}</Typography>
      </div>
    </div>
  )
}
