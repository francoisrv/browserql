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
import { DefinitionNode, ObjectTypeDefinition } from 'graphql'
import { getField, getFields, getName, getType } from '@browserql/fpql'
import FieldComposer from './FieldComposer'
import { find, sortBy } from 'lodash'
import gql from 'graphql-tag'

interface Props {
  definition: DefinitionNode
  onChange(name: string, definition: DefinitionNode): void
}

export default function DefinitionCard({ definition, onChange }: Props) {
  const [expanded, setExpanded] = useState(true)
  const [showNewField, setShowNewField] = useState(false)
  const toggle = useCallback(() => setExpanded(!expanded), [expanded])
  const onToggleShowNewField = useCallback(
    () => setShowNewField(!showNewField),
    [showNewField]
  )
  const fields =
    definition.kind === 'ObjectTypeDefinition'
      ? sortBy(getFields(definition), getName)
      : []
  return (
    <Card elevation={0} style={{ backgroundColor: '#444' }}>
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
            <ExpandMoreIcon style={{ color: 'white' }} />
          </IconButton>
        </div>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {definition.kind === 'ObjectTypeDefinition' && (
            <div>
              {fields.map((field, fieldIndex) => (
                <div key={fieldIndex} style={{ paddingBottom: 8 }}>
                  <FieldComposer
                    isLast={fields.length - 1 === fieldIndex}
                    onToggleShowNewField={onToggleShowNewField}
                    onChange={(name, changedField) => {
                      if (changedField) {
                        onChange(getName(definition), {
                          ...definition,
                          fields: fields.map((f) => {
                            if (getName(f) === name) {
                              return changedField
                            }
                            return f
                          }),
                        })
                      } else {
                        console.log(0)
                        if (find(fields, (field) => getName(field) === name)) {
                          console.log(1)
                          onChange(getName(definition), {
                            ...definition,
                            fields: fields.filter((f) => getName(f) !== name),
                          })
                        } else {
                          console.log(2)
                          console.log({ fields })
                          onChange(getName(definition), {
                            ...definition,
                            fields: [...fields],
                          })
                        }
                      }
                    }}
                    field={field}
                  />
                </div>
              ))}
              {showNewField && (
                <FieldComposer
                  onChange={(name) => {
                    if (name) {
                      const source = `type Foo { ${name}: ID }`
                      const doc = gql(source)
                      const Foo = getType('Foo')(doc) as ObjectTypeDefinition
                      const field = getField(name)(Foo)
                      onChange(getName(definition), {
                        ...definition,
                        fields: [...fields, field],
                      })
                      setShowNewField(false)
                    }
                  }}
                />
              )}
            </div>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}
