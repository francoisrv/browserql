import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import React, { useState } from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

export enum NewDefinitionKind {
  type = 'type',
  input = 'input',
}

interface Props {
  onChange(kind: NewDefinitionKind): void
}

export default function DefinitionKind({ onChange }: Props) {
  const [kind, setKind] = useState<NewDefinitionKind>(NewDefinitionKind.type)
  return (
    <FormControl>
      <Select
        value={kind}
        onChange={(_event, selected) => {
          if (selected) {
            onChange(selected.props.value)
          }
        }}
        fullWidth
        style={{ color: '#b388ff', fontSize: 24, borderColor: '#b388ff' }}
        IconComponent={() => <ArrowDropDownIcon style={{ color: '#b388ff' }} />}
      >
        <MenuItem value={NewDefinitionKind.input}>
          {NewDefinitionKind.input}
        </MenuItem>
        <MenuItem value={NewDefinitionKind.type}>
          {NewDefinitionKind.type}
        </MenuItem>
      </Select>
    </FormControl>
  )
}