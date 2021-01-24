import MockFirebase from 'mock-cloud-firestore'

const fixtureData = {
  __collection__: {
    users: {
      __doc__: {
        user_a: {
          age: 15,
          username: 'user_a',
        },
      },
    },
  },
}

export const firebase = new MockFirebase(fixtureData)

export const firestore = firebase.firestore

export const breakpoints = { xs: 0, sm: 480, md: 1024 }