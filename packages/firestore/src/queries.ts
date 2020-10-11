import * as firebase from 'firebase/app'
import 'firebase/firestore'

export async function paginate(collectionName: string) {
  const db = firebase.firestore()
  const collection = db.collection(collectionName)
  const querySnapshot = await collection.get()
  const docs: any[] = []
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() })
  })
  console.log('paginate', collectionName, docs)
  return docs
}
