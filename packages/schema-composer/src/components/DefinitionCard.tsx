import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import React, { useCallback, useState } from 'react'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import Input from './Input'
import DefinitionKind from './DefinitionKind'
import { DefinitionNode } from 'graphql'
import { getFields, getName } from '@browserql/fpql'
import FieldComposer from './FieldComposer'

interface Props {
  definition: DefinitionNode
  onChange(name: string, definition: DefinitionNode): void
}

export default function DefinitionCard({ definition, onChange }: Props) {
  const [expanded, setExpanded] = useState(true)
  const toggle = useCallback(() => setExpanded(!expanded), [expanded])
  return (
    <Card elevation={0}>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div>
            <DefinitionKind onChange={() => {}} />
          </div>
          <Input
            value={getName(definition)}
            onChangeValue={(name) => {
              onChange(getName(definition), {
                ...definition,
                name: {
                  kind: 'Name',
                  value: name,
                },
              })
            }}
          />
          <IconButton
            onClick={toggle}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </div>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {definition.kind === 'ObjectTypeDefinition' && (
            <div>
              {getFields(definition).map((field, fieldIndex) => (
                <FieldComposer
                  onChange={(name, changedField) => {
                    onChange(getName(definition), {
                      ...definition,
                      fields: getFields(definition).map((f) => {
                        if (getName(f) === name) {
                          return changedField
                        }
                        return f
                      }),
                    })
                  }}
                  field={field}
                  key={fieldIndex}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}
