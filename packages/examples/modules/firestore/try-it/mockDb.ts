import MockFirebase from 'mock-cloud-firestore'

interface Fixture {
  collection: string
  id: string
  data: any
}

interface Fixed {
  [collectionName: string]: {
    __doc__: {
      [id: string]: any
    }
  }
}

export default function mockDb(fixture: Fixture[]) {
  const fixtureData = {
    __collection__: fixture.reduce((acc, entry) => {
      if (!(entry.collection in acc)) {
        acc[entry.collection] = {
          __doc__: {},
        }
        acc[entry.collection].__doc__[entry.id] = entry.data
      }
      return acc
    }, {} as Fixed),
  }

  const firebase = new MockFirebase(fixtureData)

  return firebase.firestore()
}
