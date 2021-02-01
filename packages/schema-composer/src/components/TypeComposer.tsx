import React from 'react'
import type {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'
import { getFields, getName } from '@browserql/fpql'
import Typography from '@material-ui/core/Typography'
import FieldComposer from './FieldComposer'
import IconButton from '@material-ui/core/IconButton'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import EditIcon from '@material-ui/icons/Edit'
import FormGroup from '@material-ui/core/FormGroup'
import DefinitionKind from './DefinitionKind'
import TextField from '@material-ui/core/TextField'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import EditDefinition from './EditDefinition'

interface Props {
  type: ObjectTypeDefinitionNode | ObjectTypeExtensionNode
}

export default function TypeComposer({ type }: Props) {
  const fields = getFields(type) as FieldDefinitionNode[]
  return (
    <Accordion square>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <EditDefinition definition={type} />
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ flex: 1, padding: 24 }}>
          {fields.map((field) => (
            <FieldComposer field={field} key={getName(field)} />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
