import add from './add'

test('it should create a mutation with addOne if only one argument is passed', () => {
  const adder = add('Todo', { name: 'buy milk' })
  expect(adder).toHaveProperty('mutation')
  expect(adder).toHaveProperty('variables', { name: 'buy milk' })
})
