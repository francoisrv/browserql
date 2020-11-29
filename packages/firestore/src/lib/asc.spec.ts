import { FirestoreqlGetter, FirestoreqlType } from '../types'
import asc from './asc'

test('it should return an asc getter set to true', () => {
  expect(asc(true)).toEqual({
    type: FirestoreqlType.getter,
    name: FirestoreqlGetter.asc,
    value: true,
  })
})

test('it should return an asc getter set to false', () => {
  expect(asc(false)).toEqual({
    type: FirestoreqlType.getter,
    name: FirestoreqlGetter.asc,
    value: false,
  })
})
