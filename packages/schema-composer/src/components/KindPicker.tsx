import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import MinusIcon from '@material-ui/icons/Remove'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'
import { ParsedType } from '@browserql/fpql'
import PriorityHighIcon from '@material-ui/icons/PriorityHigh'

enum BuiltinKind {
  Boolean = 'Boolean',
  Float = 'Float',
  ID = 'ID',
  Int = 'Int',
  String = 'String',
}

interface Props {
  kind: ParsedType
  onChange(kind: ParsedType): void
}

export default function KindPicker(props: Props) {
  return (
    <FormGroup row style={{ alignItems: 'flex-end', gap: 8 }}>
      <Typography
        style={{
          opacity: 0.5,
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
        variant="h5"
      >
        [
      </Typography>

      <FormControl>
        <Select
          value={props.kind.type}
          style={{ width: 125, color: '#fff', fontSize: 18 }}
          onChange={(event, { props: { value } }) => {
            props.onChange({
              ...props.kind,
              type: value,
            })
          }}
        >
          <MenuItem value={BuiltinKind.Boolean}>{BuiltinKind.Boolean}</MenuItem>
          <MenuItem value={BuiltinKind.Float}>{BuiltinKind.Float}</MenuItem>
          <MenuItem value={BuiltinKind.ID}>{BuiltinKind.ID}</MenuItem>
          <MenuItem value={BuiltinKind.Int}>{BuiltinKind.Int}</MenuItem>
          <MenuItem value={BuiltinKind.String}>{BuiltinKind.String}</MenuItem>
        </Select>
      </FormControl>

      <Typography
        style={{
          opacity: 0.5,
          fontWeight: 'bold',
        }}
        variant="h5"
      >
        ]
      </Typography>

      <IconButton
        size="small"
        onClick={() => {
          props.onChange({
            ...props.kind,
            required: !props.kind.required,
          })
        }}
        color={props.kind.required ? 'secondary' : 'default'}
      >
        <PriorityHighIcon />
      </IconButton>
    </FormGroup>
  )
}
