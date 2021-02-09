import { readFile, writeFile } from 'fs'
import { promisify } from 'util'
import { print } from 'graphql'
import colors from 'colors'
import addField from './addField'
import addType from './addType'
import deleteType from './deleteType'
import help from './help'
import highlight from './highlight'
import init from './init'
import renameType from './renameType'
import sync from './sync'
import type from './type'
import types from './types'
import { getName } from '@browserql/fpql'
import view from './view'

const [, , file, command, ...other] = process.argv

async function run() {
  if (!file) {
    console.log(colors.bold.red('Missing file name'))
    help()
    console.log(colors.bold.red('Missing file name'))
    process.exit(1)
  }
  if (file === 'help') {
    help(command)
    process.exit(0)
  }
  if (!command) {
    const schema = (await view(file)).trim()
    if (!schema) {
      console.log(colors.magenta.bold('Empty'))
      process.exit(0)
    }
    highlight(schema)
    process.exit(0)
  }
  switch (command) {
    default:
      throw new Error(`Unknown command ${command}. Try \`graphql help\``)
    case 'init': {
      await init()
      process.exit(0)
    }
    case 'sync': {
      await sync()
      process.exit(0)
    }
    case 'view': {
      const [definition] = other
      if (!definition) {
        const schema = await view(file)
        highlight(schema)
        process.exit(0)
      }
      switch (definition) {
        default:
          throw new Error(`Unknwon definition ${definition}`)
        case 'type': {
          const [name] = other
          if (!name) {
            throw new Error('Missing type name')
          }
          highlight(await type(file, name))
          process.exit(0)
        }
        case 'types': {
          const res = await types(file)
          const got = print({ definitions: res, kind: 'Document' })
          highlight(got)
          process.exit(0)
        }
      }
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
          const [name, ...directives] = addOther
          if (!name) {
            throw new Error('Missing type name')
          }
          await addType(file, name, ...directives)
          highlight(print(await type(file, name)))
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
          await addField(file, typeName, fieldName, kind)
          highlight(print(await type(file, typeName)))
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
          await deleteType(file, name)
          // await sync()
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
          await renameType(file, name, nextName)
          highlight(await view(file))
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
