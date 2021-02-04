import React from 'react'
import { FieldDefinitionNode, parseType } from 'graphql'
import {
  getKind,
  getName,
  ParsedType,
  parseKind,
  printParsedKind,
} from '@browserql/fpql'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import TextField from '@material-ui/core/TextField'
import KindPicker from './KindPicker'
import IconButton from '@material-ui/core/IconButton'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import InputBase from '@material-ui/core/InputBase'

interface Props {
  field: FieldDefinitionNode
  onChange(name: string, field?: FieldDefinitionNode): void
  isLast: boolean
}

export default function FieldComposer({ field, onChange, isLast }: Props) {
  const handleChangeKind = (kind: ParsedType) => {
    onChange(getName(field), {
      ...field,
      type: parseType(printParsedKind(kind)),
    })
  }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <InputBase
        value={getName(field)}
        inputProps={{
          style: {
            fontWeight: 'bold',
            backgroundColor: '#444',
            color: '#fff',
            paddingLeft: 6,
            paddingRight: 6,
            textAlign: 'right',
            width: 150,
            fontSize: 18,
          },
        }}
        onChange={(e) => {
          onChange(getName(field), {
            ...field,
            name: {
              kind: 'Name',
              value: e.target.value,
            },
          })
        }}
        style={{ marginRight: 12 }}
      />
      <KindPicker
        kind={parseKind(getKind(field))}
        onChange={handleChangeKind}
      />
      <IconButton size="small" onClick={() => onChange(getName(field))}>
        <HighlightOffIcon style={{ color: '#fff' }} />
      </IconButton>
      {isLast && (
        <IconButton size="small" onClick={() => onChange(getName(field))}>
          <AddCircleOutlineIcon style={{ color: '#fff' }} />
        </IconButton>
      )}
    </div>
  )
}
