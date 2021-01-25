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
    file: 'mutation',
    async load() {
      const { default: loaded } = await import(
        './modules/executable/usage/files/mutation'
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
    module: 'firestore',
    example: 'try-it',
    file: 'tryit',
    async load() {
      const { default: loaded } = await import(
        './modules/firestore/try-it/files/tryit'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArgument',
    file: 'directive',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArgument/files/directive'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArgument',
    file: 'field',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArgument/files/field'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArgument',
    file: 'query',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArgument/files/query'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArguments',
    file: 'directive',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArguments/files/directive'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArguments',
    file: 'fields',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArguments/files/fields'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArguments',
    file: 'query',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArguments/files/query'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getDirective',
    file: 'main',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getDirective/files/main'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getExecutableOperation',
    file: 'main',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getExecutableOperation/files/main'
      )
      return loaded
    },
  },

  {
    module: 'fragments',
    example: 'usage',
    file: 'index',
    async load() {
      const { default: loaded } = await import(
        './modules/fragments/usage/files/index'
      )
      return loaded
    },
  },

  {
    module: 'client',
    example: 'resolvers',
    file: 'app',
    async load() {
      const { default: loaded } = await import(
        './modules/client/resolvers/files/app'
      )
      return loaded
    },
  },

  {
    module: 'client',
    example: 'resolvers',
    file: 'view',
    async load() {
      const { default: loaded } = await import(
        './modules/client/resolvers/files/view'
      )
      return loaded
    },
  },

  {
    module: 'graphiql',
    example: 'usage',
    file: 'example',
    async load() {
      const { default: loaded } = await import(
        './modules/graphiql/usage/files/example'
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
