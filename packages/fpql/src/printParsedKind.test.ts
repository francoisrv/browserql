import printParsedKind from './printParsedKind'

test('it should print parsed kind: ID', () => {
  expect(
    printParsedKind({
      type: 'ID',
      required: false,
      depth: 0,
      nestedRequired: [],
    })
  ).toEqual('ID')
})

test('it should print parsed kind: ID!', () => {
  expect(
    printParsedKind({
      type: 'ID',
      required: true,
      depth: 0,
      nestedRequired: [],
    })
  ).toEqual('ID!')
})

test('it should print parsed kind: [ID]', () => {
  expect(
    printParsedKind({
      type: 'ID',
      required: false,
      depth: 1,
      nestedRequired: [false],
    })
  ).toEqual('[ID]')
})

test('it should print parsed kind: [[ID]]', () => {
  expect(
    printParsedKind({
      type: 'ID',
      required: false,
      depth: 2,
      nestedRequired: [false],
    })
  ).toEqual('[[ID]]')
})

test('it should print parsed kind: [ID]!', () => {
  expect(
    printParsedKind({
      type: 'ID',
      required: true,
      depth: 1,
      nestedRequired: [false],
    })
  ).toEqual('[ID]!')
})

test('it should print parsed kind: [ID!]!', () => {
  expect(
    printParsedKind({
      type: 'ID',
      required: true,
      depth: 1,
      nestedRequired: [false],
    })
  ).toEqual('[ID]!')
})
