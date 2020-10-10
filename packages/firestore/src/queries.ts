export async function paginate(db: string) {
  return function pageinateFirestore({ collection: collectionName, where }: any) {
    const collection = db.collection(collectionName)
    const querySnapshot = await collection.get()
    const docs: any[] = []
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })
    return docs
  }
}