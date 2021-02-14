import TryClient from '@browserql/components/tryit/Client'
import React from 'react'
import { DateResolver } from 'graphql-scalars'
import connect from '@browserql/client'
import gql from 'graphql-tag'
import { print } from 'graphql'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

export default function View() {
  const schema = gql`
    type Query {
      whatTimeIsIt: Date!
    }

    type Subscription {
      timeChecked: Date!
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
      console.log('QUERY')
      pubsub.publish('MY_EVENT', new Date())
      return new Date()
    },
  }

  const queriesFile = `export function whatTimeIsIt() {
    return new Date()
  }`

  const scalars = { Date: DateResolver }

  const scalarsFile = `export { DateResolver as Date } from 'graphql-scalars'`

  const subscriptions = {
    timeChecked() {
      console.log('SUUUUUB')
      return pubsub.asyncIterator('MY_EVENT')
    },
  }

  const subscriptionsFile = `import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

export const timeChecheck = {
  subscribe() {
    return pubsub.asyncIterator('MY_EVENT')
  },
}`

  return (
    <TryClient
      schema={print(schema)}
      query={print(query)}
      scalars={scalars}
      queries={queries}
      scalarsFile={scalarsFile}
      queriesFile={queriesFile}
      subscriptionsFile={subscriptionsFile}
      subscriptions={subscriptions}
    />
  )
}

View.height = 1990
