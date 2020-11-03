import { Story } from '@storybook/react/types-6-0'
import React from 'react'
import { pick } from 'lodash'

import { connectFirestore } from '../../packages/firestore'
import GraphiQL from '../../packages/graphiql'
import { BrowserqlProvider } from '../../packages/react'

import makeFirebaseApp from '../firebase'
import FirebaseLoginSB from './Firebase'

export default {
  title: 'extensions/Firestore',
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
      <FirebaseLoginSB />
      <GraphiQL />
    </BrowserqlProvider>
  )
}

console.log(process.env)

export const Firestore = Template.bind({})
Firestore.args = {
  schema: `type Test @firestore {
  foo: String!
}`,
  API_KEY: process.env.STORYBOOK_FIREBASE_API_KEY,
  AUTHDOMAIN: process.env.STORYBOOK_FIREBASE_AUTHDOMAIN,
  BASEURL: process.env.STORYBOOK_FIREBASE_BASEURL,
  PROJECT_ID: process.env.STORYBOOK_FIREBASE_PROJECT_ID,
  STORAGEBUCKET: process.env.STORYBOOK_FIREBASE_STORAGEBUCKET,
  MESSAGING_SENDER_ID: process.env.STORYBOOK_FIREBASE_MESSAGING_SENDER_ID,
  APP_ID: process.env.STORYBOOK_FIREBASE_APP_ID,
  MEASUREMENT_ID: process.env.STORYBOOK_FIREBASE_MEASUREMENT_ID,
}
