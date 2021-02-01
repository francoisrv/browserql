import React from 'react'
import type { FieldDefinitionNode } from 'graphql'
import { getKind, getName } from '@browserql/fpql'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import KindPicker from './KindPicker'

interface Props {
  field: FieldDefinitionNode
}

export default function FieldComposer({ field }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <TextField variant="outlined" value={getName(field)} />
      <Typography>:</Typography>
      <KindPicker />
    </div>
  )
}
