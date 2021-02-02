import React from 'react'
import type { FieldDefinitionNode } from 'graphql'
import { getKind, getName, parseKind } from '@browserql/fpql'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import KindPicker from './KindPicker'
import IconButton from '@material-ui/core/IconButton'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

interface Props {
  field: FieldDefinitionNode
}

export default function FieldComposer({ field }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <TextField
        value={getName(field)}
        inputProps={{
          style: {
            fontWeight: 'bold',
            backgroundColor: '#666',
            color: '#fff',
            paddingLeft: 6,
            paddingRight: 6,
          },
        }}
      />
      <KindPicker kind={parseKind(getKind(field))} />
      <IconButton size="small">
        <HighlightOffIcon />
      </IconButton>
    </div>
  )
}
