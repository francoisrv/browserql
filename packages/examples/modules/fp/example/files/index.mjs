import fp from '@browserql/fp'

export default fp([1, 2, 3])(
  (numbers) => numbers.map((number) => number + 10), // [11, 12, 13]
  (numbers) => numbers.reduce((sum, number) => sum + number) // 36
)