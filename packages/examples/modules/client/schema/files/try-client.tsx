import TryClient from '@browserql/components/tryit/Client'
import React from 'react'
import { DateResolver } from 'graphql-scalars'
import connect from '@browserql/client'
import gql from 'graphql-tag'
import { print } from 'graphql'

export default function View() {
  const schema = gql`
    type Query {
      whatTimeIsIt: Date!
    }
    scalar Date
  `

  const query = gql`
    {
      whatTimeIsIt
    }
  `

  const queries = {
    whatTimeIsIt() {
      return new Date()
    },
  }

  const queriesFile = `export function whatTimeIsIt() {
    return new Date()
  }`

  const scalars = { Date: DateResolver }

  const scalarsFile = `export { DateResolver as Date } from 'graphql-scalars'`

  return (
    <TryClient
      schema={print(schema)}
      query={print(query)}
      scalars={scalars}
      queries={queries}
      scalarsFile={scalarsFile}
      queriesFile={queriesFile}
    />
  )
}

View.height = 1990