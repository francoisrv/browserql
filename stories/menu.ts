import { readFileSync } from 'fs'

export interface Menu {
  name: string
  doc: string
  children?: Omit<Menu, 'children'>[]
}

const menu: Menu[] = [
  {
    name: 'Firestore',
    doc: readFileSync(__dirname + '/doc/firestore/index.md', 'utf-8'),
    children: [
      {
        name: 'API',
        doc: readFileSync(__dirname + '/doc/firestore/api.md', 'utf-8'),
      },
      {
        name: 'React',
        doc: readFileSync(__dirname + '/doc/firestore/react.md', 'utf-8'),
      },
      {
        name: 'Schema',
        doc: readFileSync(__dirname + '/doc/firestore/schema.md', 'utf-8'),
      },
    ],
  },
  {
    name: 'React',
    doc: readFileSync(__dirname + '/doc/react/index.md', 'utf-8'),
    children: [
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
  },
  {
    name: 'Router',
    doc: readFileSync(__dirname + '/doc/router/index.md', 'utf-8'),
  },
]

export default menu
