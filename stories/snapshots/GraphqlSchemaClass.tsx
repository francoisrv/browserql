import * as React from 'react'
import graphql from '@browserql/graphql-schema-class'
import Code from '../components/Code'

export function Example() {
  const Todo = graphql`
    type Todo {
      title: String!
      done: Boolean @default(value: false)
    }
  `
  const todo = new Todo({ title: 'Buy milk' })
  return <Code language="json" value={JSON.stringify(todo.toJSON(), null, 2)} />
}
