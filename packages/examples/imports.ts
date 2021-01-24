export default [
  {
    module: 'cache',
    example: 'usage',
    file: 'example',
    async load() {
      const { default: loaded } = await import(
        './modules/cache/usage/files/example'
      )
      return loaded
    },
  },

  {
    module: 'executable',
    example: 'usage',
    file: 'query',
    async load() {
      const { default: loaded } = await import(
        './modules/executable/usage/files/query'
      )
      return loaded
    },
  },

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
