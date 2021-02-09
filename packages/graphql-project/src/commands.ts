import {
  getField,
  getFields,
  getKind,
  getName,
  getType,
  getTypes,
  parseKind,
  printParsedKind,
} from '@browserql/fpql'
import colors from 'colors'
import { writeFile } from 'fs'
import { parse, print } from 'graphql'
import { parseType } from 'graphql'
import { isOutputType } from 'graphql'
import { promisify } from 'util'
import help from './help'
import highlight from './highlight'
import view from './view'

const commands = [
  {
    about: 'View schema',
    command: 'view',
    async output(file: string) {
      const schema = (await view(file)).trim()
      if (!schema) {
        console.log(colors.magenta.bold('Empty'))
        process.exit(0)
      }
      highlight(schema)
      process.exit(0)
    },
  },

  {
    about: 'View help',
    command: 'help',
    async output(file: string, ...other: string[]) {
      const [cmd] = other
      help(cmd)
      process.exit(0)
    },
  },

  {
    about: 'Access schema types',
    command: 'type',
    async process(file: string, name: string, ...other: string[]) {
      let schema = parse(await view(file))
      const isField = /\w\.\w/.test(name)
      if (name && other.indexOf('--delete') !== -1 && !isField) {
        const nextSchema = {
          ...schema,
          definitions: schema.definitions.filter(
            (def) => getName(def) !== name
          ),
        }
        await promisify(writeFile)(file, print(nextSchema))
      } else if (name && !isField) {
        if (name === 'Query') {
          const Query = schema.definitions.find(
            (def) => getName(def) === 'Query'
          )
          if (!Query) {
            const schema2 = parse('type Query')
            const nextSchema = {
              ...schema,
              definitions: [...schema.definitions, schema2.definitions[0]],
            }
            await promisify(writeFile)(file, print(nextSchema))
          }
        } else {
          const type = getType(name)(schema)
          if (!type) {
            const schema2 = parse(`type ${name}`)
            const nextSchema = {
              ...schema,
              definitions: [...schema.definitions, getType(name)(schema2)],
            }
            await promisify(writeFile)(file, print(nextSchema))
          }
        }
      } else if (name && isField) {
        const [typeName, fieldName] = name.split(/\./)
        const [kind = 'ID'] = other
        let type =
          typeName === 'Query'
            ? schema.definitions.find((def) => getName(def) === 'Query')
            : getType(typeName)(schema)
        if (!type) {
          const schema2 = parse(`type ${typeName}`)
          type = getType(typeName)(schema2)
          const nextSchema = {
            ...schema,
            definitions: [...schema.definitions, type],
          }
          await promisify(writeFile)(file, print(nextSchema))
          schema = parse(await view(file))
        }
        let field = getField(fieldName)(type)
        if (!field) {
          const schema2 = parse(`type ${typeName} { ${fieldName}: ${kind}}`)
          field = getField(fieldName)(schema2.definitions[0])
          const nextSchema = {
            ...schema,
            definitions: schema.definitions.map((def) => {
              if (getName(def) === typeName) {
                return {
                  ...def,
                  fields: [...getFields(def), field],
                }
              }
              return def
            }),
            schema = parse(await view(file)),
          }
          await promisify(writeFile)(file, print(nextSchema))
          schema = parse(await view(file))
        }
        const fieldKind = getKind(field)
        if (fieldKind !== kind) {
          const nextSchema = {
            ...schema,
            definitions: schema.definitions.map((def) => {
              if (getName(def) === typeName) {
                return {
                  ...def,
                  fields: getFields(def).map((f) => {
                    if (getName(f) === fieldName) {
                      return {
                        ...f,
                        type: parseType(printParsedKind(parseKind(kind))),
                      }
                    }
                    return f
                  }),
                }
              }
              return def
            }),
          }
          await promisify(writeFile)(file, print(nextSchema))
          schema = parse(await view(file))
        }
      }
    },
    async output(file: string, name?: string, ...other: string[]) {
      const isField = /\w\.\w/.test(name)
      if (!name) {
        const schema = parse(await view(file))
        const nextSchema = {
          ...schema,
          definitions: schema.definitions.filter(
            (def) =>
              def.kind === 'ObjectTypeExtension' ||
              def.kind === 'ObjectTypeDefinition'
          ),
        }
        highlight(print(nextSchema))
        process.exit(0)
      } else if (name && !isField) {
        if (other.indexOf('--delete') !== -1) {
          console.log(colors.green(`${colors.bold('✓')} Deleted`))
          process.exit(0)
        }
        const schema = parse(await view(file))
        if (name === 'Query') {
          const nextSchema = {
            ...schema,
            definitions: schema.definitions.filter(
              (def) => getName(def) === 'Query'
            ),
          }
          highlight(print(nextSchema))
          process.exit(0)
        }
        const type = getType(name)(schema)
        if (!type) {
          const types = getTypes(schema)
          throw new Error(
            `${colors.red(
              `Type not found: ${colors.bold(
                name
              )}.\nExisting types: \n - ${types.map(getName).join('\n - ')}`
            )}`
          )
        }
        const nextSchema = {
          ...schema,
          definitions: schema.definitions.filter(
            (def) =>
              (def.kind === 'ObjectTypeExtension' ||
                def.kind === 'ObjectTypeDefinition') &&
              getName(def) === name
          ),
        }
        highlight(print(nextSchema))
        process.exit(0)
      } else if (name && isField) {
        const [typeName, fieldName] = name.split(/\./)
        const schema = parse(await view(file))
        const type =
          typeName === 'Query'
            ? schema.definitions.find((def) => getName(def) === 'Query')
            : getType(typeName)(schema)
        if (!type) {
          const types = getTypes(schema)
          throw new Error(
            `${colors.red(
              `Type not found: ${colors.bold(
                typeName
              )}.\nExisting types: \n - ${types.map(getName).join('\n - ')}`
            )}`
          )
        }
        const nextSchema = {
          ...schema,
          definitions: schema.definitions.filter(
            (def) =>
              (def.kind === 'ObjectTypeExtension' ||
                def.kind === 'ObjectTypeDefinition') &&
              getName(def) === typeName
          ),
        }
        highlight(print(nextSchema))
        process.exit(0)
      }
    },
    arguments: [
      {
        name: 'type name',
        about:
          'If specified, return type view (create it if not found). If it has two dots, it means it should rename the type (see example below)',
        example: 'MyType..MyNewTypeName',
      },
    ],
  },
]

export default commands
