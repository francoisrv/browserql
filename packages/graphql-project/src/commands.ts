import {
  getDirective,
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
import { ObjectTypeDefinitionNode } from 'graphql'
import { FieldDefinitionNode } from 'graphql'
import { isOutputType } from 'graphql'
import { promisify } from 'util'
import help from './help'
import highlight from './highlight'
import parseInput from './parseInput'
import sync from './sync'
import {
  addDirectiveToType,
  addFieldToSchema,
  addTypeToSchema,
  removeSchemaField,
  removeTypeFromSchema,
  updateFieldKind,
  updateSchemaField,
} from './Type'
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
    async process(file: string, ...args: string[]) {
      const parsedInput = parseInput('type', ...args)
      if (parsedInput.typeName) {
        const source = await view(file)
        let schema = source
          ? parse(source)
          : { definitions: [], kind: 'Document' as 'Document' }
        const deleting = args.indexOf('--delete') !== -1

        if (parsedInput.typeName) {
          let type = schema.definitions.find(
            (def) => getName(def) === parsedInput.typeName
          )
          if (!type) {
            schema = addTypeToSchema(schema, parsedInput.typeName)
            await sync(file, schema)
            type = schema.definitions.find(
              (def) => getName(def) === parsedInput.typeName
            )
          }
          if (parsedInput.fieldName) {
            let field = getField(parsedInput.fieldName)(
              type as ObjectTypeDefinitionNode
            )

            if (!field) {
              schema = addFieldToSchema(
                schema,
                parsedInput.typeName,
                parsedInput.fieldName,
                parsedInput.kind
              )
              await sync(file, schema)
              type = schema.definitions.find(
                (def) => getName(def) === parsedInput.typeName
              )
              field = getField(parsedInput.fieldName)(
                type as ObjectTypeDefinitionNode
              )
            }

            if (parsedInput.argName) {
            } else if (parsedInput.deleting) {
              schema = removeSchemaField(
                schema,
                parsedInput.typeName,
                parsedInput.fieldName
              )
              await sync(file, schema)
            }
          } else if (parsedInput.deleting) {
            schema = removeTypeFromSchema(schema, parsedInput.typeName)
            await sync(file, schema)
          }

          if (/^@/.test(other[0])) {
            const directive = getDirective(type)
            schema = addDirectiveToType(schema, parsedInput.typeName, other[0])
            await sync(file, schema)
          }
        }
      }
    },
    async output(file: string, name?: string, ...other: string[]) {
      const isField = /\w\.\w/.test(name || '')
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
