import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import React, { useState } from 'react'

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
    <FormControl
      style={{
        backgroundColor: '#333',
        alignSelf: 'stretch',
      }}
    >
      <Select
        value={kind}
        onChange={(_event, selected) => {
          if (selected) {
            onChange(selected.props.value)
          }
        }}
        fullWidth
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
