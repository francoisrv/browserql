import { Story } from '@storybook/react/types-6-0'
import gql from 'graphql-tag'
import React from 'react'
import { pick } from 'lodash'

import { connectFirestore } from '../../packages/firestore'
import GraphiQL from '../../packages/graphiql'
import { BrowserqlProvider } from '../../packages/react'

import makeFirebaseApp from '../firebase'

console.log(1234, { connectFirestore })

export default {
  title: 'browserql/Firestore',
}

const Template: Story<any> = (args) => {
  // const fql = connectFirestore({ schema: args.schema })
  // console.log(456, fql({}))

  const db = makeFirebaseApp(
    pick(args, [
      'API_KEY',
      'AUTHDOMAIN',
      'BASEURL',
      'PROJECT_ID',
      'STORAGEBUCKET',
      'MESSAGING_SENDER_ID',
      'APP_ID',
      'MEASUREMENT_ID',
    ])
  )

  const fql = connectFirestore(db, args.schema)

  return (
    <BrowserqlProvider extensions={[fql]}>
      <GraphiQL />
    </BrowserqlProvider>
  )
}

export const Firestore = Template.bind({})
Firestore.args = {
  schema: `type Test @firestore {
  foo: String!
}`,
  API_KEY: '',
  AUTHDOMAIN: '',
  BASEURL: '',
  PROJECT_ID: '',
  STORAGEBUCKET: '',
  MESSAGING_SENDER_ID: '',
  APP_ID: '',
  MEASUREMENT_ID: '',
}
