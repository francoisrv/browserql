import React, { useState } from 'react'
import { FieldDefinitionNode, parseType } from 'graphql'
import {
  getKind,
  getName,
  ParsedType,
  parseKind,
  printParsedKind,
} from '@browserql/fpql'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import SaveIcon from '@material-ui/icons/Save'
import KindPicker from './KindPicker'
import IconButton from '@material-ui/core/IconButton'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import InputBase from '@material-ui/core/InputBase'
import { Typography } from '@material-ui/core'

interface Props {
  field?: FieldDefinitionNode
  onChange(name?: string, field?: FieldDefinitionNode): void
  isLast?: boolean
  onToggleShowNewField?: () => void
}

export default function FieldComposer({
  field,
  onChange,
  isLast,
  onToggleShowNewField,
}: Props) {
  const [newFieldName, setNewFieldName] = useState('')
  const handleChangeKind = (kind: ParsedType) => {
    onChange(getName(field), {
      ...field,
      type: parseType(printParsedKind(kind)),
    })
  }
  const handleSave = () => {
    onChange(newFieldName)
    setNewFieldName('')
  }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <InputBase
        value={field ? getName(field) : newFieldName}
        placeholder="Field name"
        autoFocus={Boolean(field) === false}
        inputProps={{
          style: {
            fontWeight: 'bold',
            backgroundColor: '#444',
            color: '#fff',
            paddingLeft: 6,
            paddingRight: 6,
            textAlign: 'right',
            width: 120,
            fontSize: 24,
          },
        }}
        onChange={(e) => {
          if (field) {
            onChange(getName(field), {
              ...field,
              name: {
                kind: 'Name',
                value: e.target.value,
              },
            })
          } else {
            setNewFieldName(e.target.value)
          }
        }}
        style={{ marginRight: 12 }}
      />
      <Typography variant="h4" style={{ color: '#fff', fontWeight: 'bold' }}>
        :
      </Typography>
      <KindPicker
        kind={field ? parseKind(getKind(field)) : parseKind('ID')}
        onChange={handleChangeKind}
      />
      {Boolean(field) && (
        <IconButton size="small" onClick={() => onChange(getName(field))}>
          <HighlightOffIcon style={{ color: '#fff' }} />
        </IconButton>
      )}
      {isLast && (
        <IconButton
          size="small"
          onClick={() => {
            if (onToggleShowNewField) {
              onToggleShowNewField()
            }
          }}
        >
          <AddCircleOutlineIcon style={{ color: '#fff' }} />
        </IconButton>
      )}
      {!field && (
        <IconButton size="small" onClick={handleSave}>
          <SaveIcon style={{ color: '#fff' }} />
        </IconButton>
      )}
    </div>
  )
}

FieldComposer.defaultProps = {
  isLast: false,
}
