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
}

export default function KindPicker(props: Props) {
  const [kind, setKind] = useState(props.kind.type)
  return (
    <FormGroup row style={{ alignItems: 'flex-end', gap: 8 }}>
      <IconButton size="small">
        <Typography
          style={{
            color: '#eee',
            fontWeight: 'bold',
          }}
          variant="h5"
        >
          [
        </Typography>
      </IconButton>

      <FormControl>
        <Select value={kind} style={{ width: 125 }}>
          <MenuItem value={BuiltinKind.Boolean}>{BuiltinKind.Boolean}</MenuItem>
          <MenuItem value={BuiltinKind.Float}>{BuiltinKind.Float}</MenuItem>
          <MenuItem value={BuiltinKind.ID}>{BuiltinKind.ID}</MenuItem>
          <MenuItem value={BuiltinKind.Int}>{BuiltinKind.Int}</MenuItem>
          <MenuItem value={BuiltinKind.String}>{BuiltinKind.String}</MenuItem>
        </Select>
      </FormControl>

      <Typography
        style={{
          color: '#eee',
          fontWeight: 'bold',
        }}
        variant="h5"
      >
        ]
      </Typography>

      <IconButton size="small">
        <PriorityHighIcon />
      </IconButton>
    </FormGroup>
  )
}
