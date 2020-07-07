export function buildDocuments(snapshot: any, typeName: string) {
  const docs: any[] = []
  snapshot.forEach((doc: any) => {
    docs.push(buildDocument(doc, typeName))
  })
  return docs
}

export function buildDocument(doc: any, typeName: string) {
  return {
    id: doc.id,
    __typename: typeName,
    ...doc.data()
  }
}
