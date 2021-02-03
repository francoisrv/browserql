import React from 'react'
import SchemaComposer from '@browserql/schema-composer'
import TextField from '@material-ui/core/TextField'
import gql from 'graphql-tag'

export default function View() {
  const schema = `
  type Foo {
    id: ID
    bar: Boolean!
  }

  type Bar {
    foo: Float
  }
  `
  return (
    <div>
      <SchemaComposer schema={gql(schema)} />
    </div>
  )
}

View.height = 1000
