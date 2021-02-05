import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import React, { useCallback, useState } from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import Input from './Input'
import DefinitionKind from './DefinitionKind'
import { DefinitionNode, ObjectTypeDefinitionNode } from 'graphql'
import { getField, getFields, getName, getType } from '@browserql/fpql'
import FieldComposer from './FieldComposer'
import { find, sortBy, upperFirst } from 'lodash'
import gql from 'graphql-tag'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

interface Props {
  definition?: DefinitionNode
  onChange(name: string | null, definition?: DefinitionNode): void
}

export default function DefinitionCard({ definition, onChange }: Props) {
  const [newName, setNewName] = useState('')
  const [expanded, setExpanded] = useState(true)
  const [showNewField, setShowNewField] = useState(false)
  const toggle = useCallback(() => setExpanded(!expanded), [expanded])
  const onToggleShowNewField = useCallback(
    () => setShowNewField(!showNewField),
    [showNewField]
  )
  const fields =
    definition && definition.kind === 'ObjectTypeDefinition'
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
            value={definition ? getName(definition) : newName}
            onChangeValue={(name) => {
              if (definition) {
                onChange(getName(definition), {
                  ...definition,
                  name: {
                    kind: 'Name',
                    value: name,
                  },
                })
              } else {
                setNewName(upperFirst(name))
              }
            }}
          />
          <IconButton
            onClick={toggle}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon style={{ color: 'white' }} />
          </IconButton>
          {definition && (
            <IconButton onClick={() => onChange(getName(definition))}>
              <HighlightOffIcon style={{ color: '#fff' }} />
            </IconButton>
          )}
          {!definition && (
            <IconButton
              onClick={() => {
                if (newName) {
                  const source = `type ${newName}`
                  const node = gql(source)
                  console.log(node.definitions[0])
                  onChange(null, node.definitions[0])
                  setNewName('')
                }
              }}
            >
              <AddIcon style={{ color: '#fff' }} />
            </IconButton>
          )}
        </div>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {definition && definition.kind === 'ObjectTypeDefinition' && (
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
              <IconButton size="small" onClick={onToggleShowNewField}>
                <AddCircleOutlineIcon style={{ color: '#fff' }} />
              </IconButton>
              {showNewField && (
                <FieldComposer
                  onChange={(name) => {
                    if (name) {
                      const source = `type Foo { ${name}: ID }`
                      const doc = gql(source)
                      const Foo = getType('Foo')(
                        doc
                      ) as ObjectTypeDefinitionNode
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
