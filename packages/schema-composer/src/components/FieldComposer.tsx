import React from 'react'
import type { FieldDefinitionNode } from 'graphql'
import { getKind, getName } from '@browserql/fpql'
import Typography from '@material-ui/core/Typography'

interface Props {
  field: FieldDefinitionNode
}

export default function FieldComposer({ field }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Typography>{getName(field)}</Typography>
      <Typography>:</Typography>
      <Typography>{getKind(field)}</Typography>
    </div>
  )
}
