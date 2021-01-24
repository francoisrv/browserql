export default [
  {
    module: 'fpql',
    example: 'getArgument',
    file: 'index',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArgument/files/index'
      )
      return loaded
    },
  },

  {
    module: 'typescript-generator',
    example: 'try-it',
    file: 'index',
    async load() {
      const { default: loaded } = await import(
        './modules/typescript-generator/try-it/files/index'
      )
      return loaded
    },
  }]
