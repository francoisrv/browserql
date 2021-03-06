import React from 'react'
import State from '@browserql/components/tryit/State'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'
import { DocumentNode } from 'apollo-link'

interface IExample {
  title: string
  schema: DocumentNode
  query: DocumentNode
}

const examples: IExample[] = [
  {
    title: 'Without variables and with a nullable type',
    schema: gql`
      type Query {
        getCounter: Int
      }
    `,
    query: gql`
      {
        getCounter
      }
    `,
  },
  {
    title: 'Without variables and with a non-nullable type',
    schema: gql`
      type Query {
        getCounter: Int!
      }
    `,
    query: gql`
      {
        getCounter
      }
    `,
  },
]

function Example(example: IExample) {
  return (
    <div style={{ margin: 22 }}>
      <Typography variant="h4">{example.title}</Typography>
      <State schema={example.schema} query={example.query} />
    </div>
  )
}

export default function View() {
  return (
    <>
      {examples.map((example, index) => (
        <Example key={index} {...example} />
      ))}
    </>
  )
}

View.height = 1000
