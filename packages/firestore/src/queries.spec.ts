// @ts-ignore
import { mockFirebase } from 'firestore-jest-mock'

import './firebaseConfig'

import { getById, getOne, paginate } from './queries'
import { where } from './utils'

// mockFirebase({
//   database: {
//     foos: [
//       { id: 'abc123', name: 'Homer Simpson' },
//       { id: 'abc456', name: 'Lisa Simpson' },
//     ],
//     posts: [{ id: '123abc', title: 'Really cool title' }],
//   },
// })

const tests = [{"id":"b7a9kQCqq5QnmgeSTqv7","foo":"barz"},{"id":"mA3PZxGjX3zGOVQrT4uj","foo":"bar"}]

test('paginate', async () => {
  const docs = await paginate('tests')
  expect(Array.isArray(docs)).toBe(true)
  expect(docs).toHaveLength(tests.length)
  docs.forEach(doc => {
    expect(doc).toHaveProperty('id')
    expect(doc).toHaveProperty('foo')
  })
})

test('paginate with where', async () => {
  const docs = await paginate('tests', [where('foo').equals('bar')])
  expect(Array.isArray(docs)).toBe(true)
  expect(docs).toHaveLength(1)
  docs.forEach(doc => {
    expect(doc).toHaveProperty('id')
    expect(doc).toHaveProperty('foo')
  })
})

test('get one', async () => {
  const doc = await getOne('tests')
  expect(doc).toHaveProperty('id')
  expect(doc).toHaveProperty('foo')
})

test('get by id', async () => {
  const doc = await getById('tests', 'mA3PZxGjX3zGOVQrT4uj')
  expect(doc).toHaveProperty('id', 'mA3PZxGjX3zGOVQrT4uj')
  expect(doc).toHaveProperty('foo', 'bar')
})
