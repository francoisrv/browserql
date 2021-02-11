export default [
  {
    module: 'cache',
    example: 'get',
    file: 'default',
    async load() {
      const { default: loaded } = await import(
        './modules/cache/get/files/default'
      )
      return loaded
    },
  },

  {
    module: 'cache',
    example: 'get',
    file: 'null',
    async load() {
      const { default: loaded } = await import(
        './modules/cache/get/files/null'
      )
      return loaded
    },
  },

  {
    module: 'cache',
    example: 'get',
    file: 'undefined',
    async load() {
      const { default: loaded } = await import(
        './modules/cache/get/files/undefined'
      )
      return loaded
    },
  },

  {
    module: 'cache',
    example: 'get',
    file: 'view',
    async load() {
      const { default: loaded } = await import(
        './modules/cache/get/files/view'
      )
      return loaded
    },
  },

  {
    module: 'cache',
    example: 'try-it',
    file: 'tryit-render',
    async load() {
      const { default: loaded } = await import(
        './modules/cache/try-it/files/tryit-render'
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
    module: 'executable',
    example: 'usage',
    file: 'mutation-render',
    async load() {
      const { default: loaded } = await import(
        './modules/executable/usage/files/mutation-render'
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
    file: 'query-render',
    async load() {
      const { default: loaded } = await import(
        './modules/executable/usage/files/query-render'
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
    module: 'fp',
    example: 'example',
    file: 'index-render',
    async load() {
      const { default: loaded } = await import(
        './modules/fp/example/files/index-render'
      )
      return loaded
    },
  },

  {
    module: 'fp',
    example: 'example',
    file: 'promises-render',
    async load() {
      const { default: loaded } = await import(
        './modules/fp/example/files/promises-render'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArgument',
    file: 'directive-render',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArgument/files/directive-render'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArgument',
    file: 'field-render',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArgument/files/field-render'
      )
      return loaded
    },
  },

  {
    module: 'fpql',
    example: 'getArgument',
    file: 'query-render',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getArgument/files/query-render'
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
    module: 'fpql',
    example: 'getKind',
    file: 'view-get-query-kind',
    async load() {
      const { default: loaded } = await import(
        './modules/fpql/getKind/files/view-get-query-kind'
      )
      return loaded
    },
  },

  {
    module: 'graphql-schema-class',
    example: 'try-it',
    file: 'example',
    async load() {
      const { default: loaded } = await import(
        './modules/graphql-schema-class/try-it/files/example'
      )
      return loaded
    },
  },

  {
    module: 'graphql-schema-class',
    example: 'value-parser',
    file: 'example',
    async load() {
      const { default: loaded } = await import(
        './modules/graphql-schema-class/value-parser/files/example'
      )
      return loaded
    },
  },

  {
    module: 'graphiql',
    example: 'usage',
    file: 'view',
    async load() {
      const { default: loaded } = await import(
        './modules/graphiql/usage/files/view'
      )
      return loaded
    },
  },

  {
    module: 'graphql-schema-class',
    example: 'default-values',
    file: 'example',
    async load() {
      const { default: loaded } = await import(
        './modules/graphql-schema-class/default-values/files/example'
      )
      return loaded
    },
  },

  {
    module: 'http',
    example: 'about',
    file: 'app',
    async load() {
      const { default: loaded } = await import(
        './modules/http/about/files/app'
      )
      return loaded
    },
  },

  {
    module: 'http',
    example: 'about',
    file: 'response',
    async load() {
      const { default: loaded } = await import(
        './modules/http/about/files/response'
      )
      return loaded
    },
  },

  {
    module: 'react',
    example: 'use-query',
    file: 'example',
    async load() {
      const { default: loaded } = await import(
        './modules/react/use-query/files/example'
      )
      return loaded
    },
  },

  {
    module: 'react',
    example: 'use-query',
    file: 'index',
    async load() {
      const { default: loaded } = await import(
        './modules/react/use-query/files/index'
      )
      return loaded
    },
  },

  {
    module: 'schema-composer',
    example: 'try-it',
    file: 'view',
    async load() {
      const { default: loaded } = await import(
        './modules/schema-composer/try-it/files/view'
      )
      return loaded
    },
  },

  {
    module: 'input',
    example: 'example',
    file: 'example',
    async load() {
      const { default: loaded } = await import(
        './modules/input/example/files/example'
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
