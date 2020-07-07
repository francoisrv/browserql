import * as firebase from 'firebase/app'
import 'firebase/firestore'
import connect, { Client } from '@browserql/client'
import { plugin as FirestorePlugin, connect as FirestoreConnect } from '.'
import gql from 'graphql-tag'
import { buildDocuments } from './utils'

const sample = gql`
type Foo @firestore {
  name: String
}
`

describe('firestoreql', () => {
  let firestore: any
  let db: ReturnType<typeof FirestoreConnect>
  let client: Client

  beforeAll(() => {
    firebase.initializeApp({
      apiKey: 'AIzaSyDxx1IiOnwgZZzE0_YlGmCGGITQGL-VnQA',
      projectId: 'lestudio-75c34',
      appId: '1:337318935047:web:4ca842544422cc8c30c8a2',
      authDomain: 'lestudio-75c34.firebaseapp.com'
    })
    firestore = firebase.firestore()
    client = connect({
      plugins: [FirestorePlugin(firestore)],
      schema: sample,
    })
    db = FirestoreConnect(client, firestore)
    // console.log(client.printSchema())
  })

  describe.only('Set', () => {
    describe('add document', () => {
      it('should work', async () => {
        const firedocs = buildDocuments(await firestore.collection('foos').get(), 'Foo')
        expect(firedocs).toEqual([])
        const graphdocs = client.query('firestoreGetDocuments_Foo')
        console.log(graphdocs)
        // await db.collection('Foo').add({ name: 'boom' })
      })
    })
  })

  describe('Get', () => {
    describe('get by id', () => {
      it('should work', async () => {
        await db.collection('Foo').get()
      })
    })
  })
})
