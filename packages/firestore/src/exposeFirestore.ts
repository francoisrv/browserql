import type { BrowserqlClient } from "@browserql/types";
import makeContext from './makeContext';

export default function exportFirestore(client: BrowserqlClient) {
  return makeContext().firestore
}
