import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import type { ObjectTypeDefinitionNode } from 'graphql'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import React, { useCallback, useState } from 'react'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import { parse } from 'graphql'
import { getType } from '@browserql/fpql'
import DefinitionKind, { NewDefinitionKind } from './DefinitionKind'

enum NewDefinitionType {
  new = 'new',
  extend = 'extend',
}

interface Props {
  onAdded(type: ObjectTypeDefinitionNode): void
}

export default function AddComposer({ onAdded }: Props) {
  const [type, setType] = useState<NewDefinitionType>(NewDefinitionType.new)
  const [kind, setKind] = useState<NewDefinitionKind>(NewDefinitionKind.type)
  const [name, setName] = useState('')

  const handleChangeType = (nextType: NewDefinitionType) => setType(nextType)
  const handleChangeKind = (nextKind: NewDefinitionKind) => setKind(nextKind)

  const handleAdd = useCallback(() => {
    const source = `type ${name}`
    const parsed = parse(source)
    const gType = getType(name)(parsed)
    onAdded(gType)
    setName('')
  }, [type, kind, name])

  return (
    <div>
      <FormGroup row>
        <FormControl>
          <Select
            value={type}
            onChange={(_event, selected) => {
              if (selected) {
                handleChangeType(selected.props.value)
              }
            }}
            variant="outlined"
          >
            <MenuItem value={NewDefinitionType.new}>
              {NewDefinitionType.new}
            </MenuItem>
            <MenuItem value={NewDefinitionType.extend}>
              {NewDefinitionType.extend}
            </MenuItem>
          </Select>
        </FormControl>
        <DefinitionKind onChange={handleChangeKind} />
        <FormControl style={{ flex: 1 }}>
          <TextField
            placeholder={`Enter ${
              type === NewDefinitionType.new ? 'new' : 'extended'
            } type name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </FormControl>
        <IconButton disabled={Boolean(name) === false} onClick={handleAdd}>
          <AddIcon />
        </IconButton>
      </FormGroup>
    </div>
  )
}
