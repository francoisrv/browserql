import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import MinusIcon from '@material-ui/icons/Remove'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'

enum BuiltinKind {
  Boolean = 'Boolean',
  Float = 'Float',
  ID = 'ID',
  Int = 'Int',
  String = 'String',
}

export default function KindPicker() {
  return (
    <FormGroup row style={{ alignItems: 'center', gap: 8 }}>
      <FormControl>
        <Select variant="outlined">
          <MenuItem value={BuiltinKind.Boolean}>{BuiltinKind.Boolean}</MenuItem>
          <MenuItem value={BuiltinKind.Float}>{BuiltinKind.Float}</MenuItem>
          <MenuItem value={BuiltinKind.ID}>{BuiltinKind.ID}</MenuItem>
          <MenuItem value={BuiltinKind.Int}>{BuiltinKind.Int}</MenuItem>
          <MenuItem value={BuiltinKind.String}>{BuiltinKind.String}</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel control={<Checkbox />} label="Required" />
      <FormControlLabel control={<Checkbox />} label="Array" />
    </FormGroup>
  )
}
