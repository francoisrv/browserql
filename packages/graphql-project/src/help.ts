import colors from 'colors'
import commands from './commands'

const commands2 = [
  {
    about: 'View schema',
    arguments: [
      {
        name: 'file',
        about: 'The file with a graphql definition in it',
        required: true,
        example: 'schema.graphql',
      },
    ],
  },
  {
    about: 'View help',
    command: 'help',
    arguments: [
      {
        name: 'command',
        about: 'View help for a specific command',
        example: 'add field',
        param: true,
      },
    ],
  },

  {
    about: 'Add new directive',
    command: 'add directive',
    arguments: [
      {
        name: 'directive name',
        about: 'The name of the directive you want to add',
        required: true,
      },
      {
        name: 'location',
        about:
          'The location of the directive you want to add, separated by comma.',
        required: true,
        example: 'field,object,input',
      },
    ],
  },
  {
    about: 'Add new field',
    command: 'add field',
    arguments: [
      {
        name: 'path',
        about:
          'The path of the field. Write it as: type.field, with a dot between them.',
        required: true,
        example: 'MyType.myField',
      },
      {
        name: 'kind',
        about: 'The kind of the field',
        required: true,
        example: 'ID !',
      },
    ],
  },
  {
    about: 'Add new type',
    command: 'add type',
    arguments: [
      {
        name: 'type name',
        about: 'The name of the type you want to add',
        required: true,
      },
      {
        name: 'directive(s)',
        about: 'Directives for the new type',
        example: '@myDirective(myArg: "myValue")',
        spreadable: true,
      },
    ],
  },
  {
    about: 'Change field kind',
    command: 'change field',
    arguments: [
      {
        name: 'path',
        about:
          'The path of the field. Write it as: type.field, with a dot between them.',
        required: true,
        example: 'MyType.myField',
      },
      {
        name: 'kind',
        about: 'The new kind of the field',
        required: true,
        example: 'ID !',
      },
    ],
  },
  {
    about: 'Delete type',
    command: 'delete type',
    arguments: [
      {
        name: 'type name',
        about: 'The name of the type you want to delete',
        required: true,
      },
    ],
  },
  {
    about: 'Rename type',
    command: 'rename type',
    arguments: [
      {
        name: 'type name',
        about: 'The name of the type you want to rename',
        required: true,
      },
      {
        name: 'new name',
        about: 'The new name of the type',
        required: true,
      },
    ],
  },
  {
    about: 'View type definition',
    command: 'view type',
    arguments: [
      {
        name: 'type name',
        about: 'The name of the type you want to view',
        required: true,
      },
    ],
  },
  {
    about: 'View type names',
    command: 'view types',
  },
]

export default function help(command?: string) {
  console.log(
    colors.yellow.bold('graphql'),
    colors.magenta('v').concat(colors.bold.magenta('1.0.0'))
  )
  console.log()
  console.log('-'.repeat(35))
  console.log('Manage a GraphQL file from terminal')
  console.log('-'.repeat(35))
  console.log()
  console.log(' * Usage: graphql <file> <command> <...options>')
  console.log()
  commands
    .filter((cmd) => {
      if (command) {
        return cmd.command === command
      }
      return true
    })
    .forEach((cmd) => {
      console.log(colors.bold(cmd.about))
      console.log(
        colors.italic.gray('>'),
        colors.italic('graphql'),
        colors.italic.yellow(cmd.command || ''),
        cmd.arguments
          ? cmd.arguments
              .map((arg) =>
                [
                  arg.required ? '' : '[',
                  arg.spreadable ? colors.underline('...') : '',
                  colors.underline(arg.name.concat(arg.required ? '' : ']')),
                ].join('')
              )
              .join(' ')
          : ''
      )
      if (cmd.arguments) {
        console.log()
        console.log('  Arguments:')
        cmd.arguments.forEach((arg) => {
          const tab = 13 - arg.name.length
          console.log(
            colors.grey('  -'),
            colors.underline(arg.name),
            ' '.repeat(tab > 0 ? tab : 0),
            arg.about
          )
          console.log(
            ' '.repeat(18),
            `(${arg.required ? 'Required' : 'Optional'}${
              arg.spreadable ? ', can be used multiple times' : ''
            })`
          )
          if (arg.example) {
            console.log(
              ' '.repeat(18),
              colors.italic.underline('Example:'),
              // colors.magenta.bold('graphql'),
              // colors.magenta.bold(cmd.command),
              colors.magenta.bold.italic(
                `"${arg.example.replace(/"/g, '\\"')}"`
              )
            )
          }
        })
      }
      console.log()
    })
}
