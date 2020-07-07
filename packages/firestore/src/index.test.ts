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

  async function getFoos() {
    return buildDocuments(
      await firestore.collection('foos').get(),
      'Foo'
    )
  }

  async function emptyFoos() {
    const docs = await getFoos()
    for (const doc of docs) {
      await firestore.collection('foos').doc(doc.id).delete()
    }
  }

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
    console.log(client.printSchema())
  })

  describe.only('Set', () => {
    describe('add document', () => {
      beforeAll(async ()=> {
        await db.collection('Foo').add({ name: 'boom' })
      })

      afterAll(emptyFoos)

      it('should have inserted data in firestore', async () => {
        expect(await getFoos()).toHaveLength(1)
      })

      it('should have updated cache', () => {
        // const docs = client.query('firestoreGetDocuments_Foo')
        // expect(docs).toHaveLength(1)
        // expect(docs[0]).toHaveProperty('name', 'boom')
        // expect(docs[0]).toHaveProperty('__typename', 'Foo')
        // expect(docs[0]).toHaveProperty('id')
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
