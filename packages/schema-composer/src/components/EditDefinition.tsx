import { getFields, getName } from '@browserql/fpql'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from 'graphql'
import React, { useCallback, useState } from 'react'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import EditIcon from '@material-ui/icons/Edit'
import FormGroup from '@material-ui/core/FormGroup'
import DefinitionKind from './DefinitionKind'
import TextField from '@material-ui/core/TextField'

interface Props {
  definition: ObjectTypeDefinitionNode | ObjectTypeExtensionNode
}

export default function EditDefinition({ definition }: Props) {
  const [edit, setEdit] = useState(true)
  const fields = getFields(definition)
  const toggleEdit = useCallback(() => setEdit(!edit), [edit])
  let content
  if (edit) {
    content = (
      <FormGroup row style={{ alignItems: 'center', gap: 8 }}>
        <DefinitionKind onChange={() => {}} />
        <TextField
          value={getName(definition)}
          style={{ flex: 1 }}
          variant="filled"
        />
      </FormGroup>
    )
  } else {
    content = (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Typography>type {getName(definition)}</Typography>
        <Typography style={{ color: '#999' }}>
          {`{ ${fields.length} fields, 0 directives }`}
        </Typography>
      </div>
    )
  }
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {content}
      <div>
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            toggleEdit()
            return false
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton>
          <HighlightOffIcon />
        </IconButton>
      </div>
    </div>
  )
}
