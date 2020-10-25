import fp from './fp'

test('it should work', () => {
  const res = fp<[string, string]>('HELLO WORLD')(
    (string) => string.toLowerCase(),
    (string) => string.split(' '),
    (strings: string[]) => strings.map((word) => `(${word})`)
  )
  expect(res).toEqual(['(hello)', '(world)'])
})

test('it should work with error hanlders', () => {
  const res = fp()(
    [
      () => {
        throw new Error('Oops')
      },
      error => error.message
    ]
  )
  expect(res).toEqual('Oops')
})

test('it should work with promises', async () => {
  const res = await fp.promise('HELLO WORLD')(
    async (string) => string.toLowerCase(),
    async (string) => string.split(' '),
    async (strings: string[]) => strings.map((word) => `(${word})`)
  )
  expect(res).toEqual(['(hello)', '(world)'])
})
