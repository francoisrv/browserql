import fp from '@browserql/fp'

export default () => fp.promise(1)(
  async input => input + 1
)