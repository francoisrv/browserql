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
      name: 'About',
      doc: readFileSync(__dirname + '/doc/client/about.md', 'utf-8'),
    },
  ],
  HTTP: [
    {
      name: 'About',
      doc: readFileSync(__dirname + '/doc/http/about.md', 'utf-8'),
    },
  ],
  Rest: [],
  State: [],
  React: [
    {
      name: 'Provider',
      doc: readFileSync(__dirname + '/doc/react/provider.md', 'utf-8'),
    },
    {
      name: 'Query',
      doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
    },
    {
      name: 'Mutation',
      doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
    },
    {
      name: 'withQuery',
      doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
    },
    {
      name: 'withMutation',
      doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
    },
  ],
  Firestore: [
    {
      name: 'Quick start',
      doc: readFileSync(__dirname + '/doc/firestore/usage.md', 'utf-8'),
    },
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
      name: 'Operations',
      doc: readFileSync(__dirname + '/doc/utils/operations.md', 'utf-8'),
    },
    {
      name: 'Resolved',
      doc: readFileSync(__dirname + '/doc/utils/resolved.md', 'utf-8'),
    },
    {
      name: 'Scalars',
      doc: readFileSync(__dirname + '/doc/utils/scalars.md', 'utf-8'),
    },
  ],
}

export default menu
