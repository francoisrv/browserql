import * as React from 'react'
import gql from 'graphql-tag'
import { GraphqlSchemaClass } from '@browserql/graphql-schema-class'
import Code from '../Code'

export function Example() {
  class Todo extends GraphqlSchemaClass<{ title: string }> {
    static schema = gql`
      type Todo {
        title: String!
        done: Boolean @default(value: false)
      }
    `
  }
  const todo = new Todo({ title: 'Buy milk' })
  return <Code language="json" value={JSON.stringify(todo.toJSON(), null, 2)} />
}
