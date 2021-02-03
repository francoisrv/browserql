import React from 'react'
import { FieldDefinitionNode, parseType } from 'graphql'
import {
  getKind,
  getName,
  ParsedType,
  parseKind,
  printParsedKind,
} from '@browserql/fpql'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import KindPicker from './KindPicker'
import IconButton from '@material-ui/core/IconButton'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

interface Props {
  field: FieldDefinitionNode
  onChange(field: FieldDefinitionNode): void
}

export default function FieldComposer({ field, onChange }: Props) {
  const handleChangeKind = (kind: ParsedType) => {
    onChange({ ...field, type: parseType(printParsedKind(kind)) })
  }
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
      <KindPicker
        kind={parseKind(getKind(field))}
        onChange={handleChangeKind}
      />
      <IconButton size="small">
        <HighlightOffIcon />
      </IconButton>
    </div>
  )
}
