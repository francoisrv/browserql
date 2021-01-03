import { readFileSync } from 'fs'

export interface MenuItem {
  name: string
  doc: string
}

export interface Menu {
  [name: string]: MenuItem[]
}

const menu: Menu = {
  browserql: [
    {
      name: 'About',
      doc: readFileSync(__dirname + '/doc/browserql/about.md', 'utf-8'),
    },
  ],
  Client: [
    {
      name: 'Usage',
      doc: readFileSync(__dirname + '/doc/client/about.md', 'utf-8'),
    },
  ],
  Recipes: [
    {
      name: 'HTTP',
      doc: readFileSync(__dirname + '/doc/http/about.md', 'utf-8'),
    },
    {
      name: 'Rest',
      doc: readFileSync(__dirname + '/doc/http/rest.md', 'utf-8'),
    },
    {
      name: 'State',
      doc: readFileSync(__dirname + '/doc/state/state.md', 'utf-8'),
    },
    {
      name: 'Firestore',
      doc: readFileSync(__dirname + '/doc/firestore/usage.md', 'utf-8'),
    },
  ],
  React: [
    {
      name: 'Provider',
      doc: readFileSync(__dirname + '/doc/react/provider.md', 'utf-8'),
    },
    {
      name: 'UseQuery',
      doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
    },
    {
      name: 'UseMutation',
      doc: readFileSync(__dirname + '/doc/react/mutation.md', 'utf-8'),
    },
    {
      name: 'withQuery',
      doc: readFileSync(__dirname + '/doc/react/withquery.md', 'utf-8'),
    },
    {
      name: 'withMutation',
      doc: readFileSync(__dirname + '/doc/react/withmutation.md', 'utf-8'),
    },
    {
      name: 'GraphiQL',
      doc: readFileSync(__dirname + '/doc/react/graphiql.md', 'utf-8'),
    },
  ],
  Firestore: [
    {
      name: 'Schema',
      doc: readFileSync(__dirname + '/doc/firestore/schema.md', 'utf-8'),
    },
    {
      name: 'API',
      doc: readFileSync(__dirname + '/doc/firestore/api.md', 'utf-8'),
    },
    {
      name: 'React',
      doc: readFileSync(__dirname + '/doc/firestore/react.md', 'utf-8'),
    },
  ],
  Utils: [
    {
      name: 'Cache',
      doc: readFileSync(__dirname + '/doc/utils/cache.md', 'utf-8'),
    },
    {
      name: 'Directives',
      doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
    },
    {
      name: 'FP',
      doc: readFileSync(__dirname + '/doc/utils/fp.md', 'utf-8'),
    },
    {
      name: 'FPQL',
      doc: readFileSync(__dirname + '/doc/utils/fpql.md', 'utf-8'),
    },
    {
      name: 'Fragments',
      doc: readFileSync(__dirname + '/doc/utils/fragments.md', 'utf-8'),
    },
    {
      name: 'Graphql Class',
      doc: readFileSync(__dirname + '/doc/utils/graphql-class.md', 'utf-8'),
    },
    {
      name: 'Executable',
      doc: readFileSync(__dirname + '/doc/utils/executable.md', 'utf-8'),
    },
    {
      name: 'Scalars',
      doc: readFileSync(__dirname + '/doc/utils/scalars.md', 'utf-8'),
    },
    {
      name: 'Typescript generator',
      doc: readFileSync(
        __dirname + '/doc/utils/typescript-generator.md',
        'utf-8'
      ),
    },
  ],
}

export default menu

export const mds = {
  'firestore/api/add': readFileSync(
    __dirname + '/doc/firestore/api/add.md',
    'utf-8'
  ),
  'firestore/api/asc': readFileSync(
    __dirname + '/doc/firestore/api/asc.md',
    'utf-8'
  ),
  'firestore/api/build': readFileSync(
    __dirname + '/doc/firestore/api/build.md',
    'utf-8'
  ),
  'firestore/api/count': readFileSync(
    __dirname + '/doc/firestore/api/count.md',
    'utf-8'
  ),
  'firestore/api/connect': readFileSync(
    __dirname + '/doc/firestore/api/connect.md',
    'utf-8'
  ),
  'firestore/api/first': readFileSync(
    __dirname + '/doc/firestore/api/first.md',
    'utf-8'
  ),
  'firestore/api/get': readFileSync(
    __dirname + '/doc/firestore/api/get.md',
    'utf-8'
  ),
  'firestore/api/increment': readFileSync(
    __dirname + '/doc/firestore/api/increment.md',
    'utf-8'
  ),
  'firestore/api/last': readFileSync(
    __dirname + '/doc/firestore/api/last.md',
    'utf-8'
  ),
  'firestore/api/limit': readFileSync(
    __dirname + '/doc/firestore/api/limit.md',
    'utf-8'
  ),
  'firestore/api/multiply': readFileSync(
    __dirname + '/doc/firestore/api/multiply.md',
    'utf-8'
  ),
  'firestore/api/orderBy': readFileSync(
    __dirname + '/doc/firestore/api/orderBy.md',
    'utf-8'
  ),
  'firestore/api/page': readFileSync(
    __dirname + '/doc/firestore/api/page.md',
    'utf-8'
  ),
  'firestore/api/remove': readFileSync(
    __dirname + '/doc/firestore/api/remove.md',
    'utf-8'
  ),
  'firestore/api/set': readFileSync(
    __dirname + '/doc/firestore/api/set.md',
    'utf-8'
  ),
  'firestore/api/where': readFileSync(
    __dirname + '/doc/firestore/api/where.md',
    'utf-8'
  ),

  'client/schema': readFileSync(__dirname + '/doc/client/schema.md', 'utf-8'),
  'client/resolvers': readFileSync(
    __dirname + '/doc/client/resolvers.md',
    'utf-8'
  ),
  'client/quick-start': readFileSync(
    __dirname + '/doc/client/quick-start.md',
    'utf-8'
  ),
  'client/demo': readFileSync(__dirname + '/doc/client/demo.md', 'utf-8'),

  'utils/cache/get': readFileSync(
    __dirname + '/doc/utils/cache/get.md',
    'utf-8'
  ),
  'utils/cache/set': readFileSync(
    __dirname + '/doc/utils/cache/set.md',
    'utf-8'
  ),
  'utils/cache/increment': readFileSync(
    __dirname + '/doc/utils/cache/increment.md',
    'utf-8'
  ),
  'utils/cache/multiply': readFileSync(
    __dirname + '/doc/utils/cache/multiply.md',
    'utf-8'
  ),
  'utils/cache/toggle': readFileSync(
    __dirname + '/doc/utils/cache/toggle.md',
    'utf-8'
  ),
  'utils/cache/filter': readFileSync(
    __dirname + '/doc/utils/cache/filter.md',
    'utf-8'
  ),
  'utils/cache/map': readFileSync(
    __dirname + '/doc/utils/cache/map.md',
    'utf-8'
  ),
  'utils/cache/pop': readFileSync(
    __dirname + '/doc/utils/cache/pop.md',
    'utf-8'
  ),
  'utils/cache/pull': readFileSync(
    __dirname + '/doc/utils/cache/pull.md',
    'utf-8'
  ),
  'utils/cache/push': readFileSync(
    __dirname + '/doc/utils/cache/push.md',
    'utf-8'
  ),
  'utils/cache/shift': readFileSync(
    __dirname + '/doc/utils/cache/shift.md',
    'utf-8'
  ),

  'utils/fpql/getArgument': readFileSync(
    __dirname + '/doc/utils/fpql/getArgument.md',
    'utf-8'
  ),
  'utils/fpql/getDirective': readFileSync(
    __dirname + '/doc/utils/fpql/getDirective.md',
    'utf-8'
  ),
  'utils/fpql/getExecutableQueries': readFileSync(
    __dirname + '/doc/utils/fpql/getExecutableQueries.md',
    'utf-8'
  ),
  'utils/fpql/getName': readFileSync(
    __dirname + '/doc/utils/fpql/getName.md',
    'utf-8'
  ),
  'utils/fpql/getScalar': readFileSync(
    __dirname + '/doc/utils/fpql/getScalar.md',
    'utf-8'
  ),
  'utils/fpql/getScalars': readFileSync(
    __dirname + '/doc/utils/fpql/getScalars.md',
    'utf-8'
  ),
  'utils/fpql/getTypes': readFileSync(
    __dirname + '/doc/utils/fpql/getTypes.md',
    'utf-8'
  ),
  'utils/fpql/getValue': readFileSync(
    __dirname + '/doc/utils/fpql/getValue.md',
    'utf-8'
  ),
  'utils/fpql/group': readFileSync(
    __dirname + '/doc/utils/fpql/group.md',
    'utf-8'
  ),
  'utils/fpql/merge': readFileSync(
    __dirname + '/doc/utils/fpql/merge.md',
    'utf-8'
  ),
  'http/url': readFileSync(__dirname + '/doc/http/url.md', 'utf-8'),
  'utils/fpql/getDefaultValue': readFileSync(
    __dirname + '/doc/utils/fpql/getDefaultValue.md',
    'utf-8'
  ),
  'utils/executable/query': readFileSync(
    __dirname + '/doc/utils/executable/query.md',
    'utf-8'
  ),
}
