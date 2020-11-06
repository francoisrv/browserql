import type { BrowserqlClient } from '@browserql/types'
import { DocumentNode } from 'graphql'
import makeContext from './makeContext'

export default function exportFirestore(client: BrowserqlClient) {
  // return makeContext(client.schema as DocumentNode).firestore
}
