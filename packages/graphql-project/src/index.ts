import { readFile } from 'fs'
import { promisify } from 'util'
import addField from './addField'
import addType from './addType'
import deleteType from './deleteType'
import highlight from './highlight'
import init from './init'
import renameType from './renameType'
import sync from './sync'
import type from './type'
import types from './types'

const HELP = `
graphql (view schema)

graphql help (view help)

graphql init (init new graphql project)

graphql sync (sync project)

graphql types (view type names)

graphql type <typename> (view type)

graphql add type <typename> (add new type)

graphql add field <typename.fieldname> <kind> (add new field)

graphql rename type <typename> <newname> (rename type)

graphql delete type <typename> (delete type)
`

const [, , command, ...other] = process.argv

async function run() {
  if (!command) {
    const schema = (
      await promisify(readFile)('graphql/schema.graphql')
    ).toString()
    highlight(schema)
    process.exit(0)
  }
  switch (command) {
    default:
      throw new Error(`Unknown command ${command}. Try \`graphql help\``)
    case 'help': {
      console.log(HELP)
      process.exit(0)
    }
    case 'init': {
      await init()
      process.exit(0)
    }
    case 'sync': {
      await sync()
      process.exit(0)
    }
    case 'types': {
      console.log(await types())
      process.exit(0)
    }
    case 'type': {
      const [name] = other
      if (!name) {
        throw new Error('Missing type name')
      }
      highlight(await type(name))
      process.exit(0)
    }
    case 'add': {
      const [def, ...addOther] = other
      if (!def) {
        throw new Error('Missing definition kind')
      }
      switch (def) {
        default:
          throw new Error(`Unknown definition kind: ${def}`)
        case 'type': {
          const [name] = addOther
          if (!name) {
            throw new Error('Missing type name')
          }
          await addType(name)
          await sync()
          process.exit(0)
        }
        case 'field': {
          const [path, kind = 'ID'] = addOther
          if (!path) {
            throw new Error('Missing field path, ie type.field')
          }
          if (!kind) {
            throw new Error('Missing field kind')
          }
          const [typeName, fieldName] = path.split(/\./)
          if (!typeName) {
            throw new Error('Missing type name in path')
          }
          if (!fieldName) {
            throw new Error(`Missing field name in path ${path}`)
          }
          await addField(typeName, fieldName, kind)
          await sync()
          process.exit(0)
        }
      }
    }
    case 'delete': {
      const [def, ...deleteOther] = other
      if (!def) {
        throw new Error('Missing definition kind')
      }
      switch (def) {
        default:
          throw new Error(`Unknown definition kind: ${def}`)
        case 'type': {
          const [name] = deleteOther
          if (!name) {
            throw new Error('Missing type name')
          }
          await deleteType(name)
          await sync()
          process.exit(0)
        }
      }
    }

    case 'rename': {
      const [def, ...renameOther] = other
      if (!def) {
        throw new Error('Missing definition kind')
      }
      switch (def) {
        default:
          throw new Error(`Unknown definition kind: ${def}`)
        case 'type': {
          const [name, nextName] = renameOther
          if (!name) {
            throw new Error('Missing type name')
          }
          if (!nextName) {
            throw new Error('Missing type new name')
          }
          await renameType(name, nextName)
          await sync()
          process.exit(0)
        }
      }
    }
  }
}

run().catch((error) => {
  console.log(error)
  process.exit(1)
})
