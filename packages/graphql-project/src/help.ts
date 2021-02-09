import colors from 'colors'

const commands = [
  {
    about: 'View schema',
  },
  {
    about: 'View help',
    command: 'help',
    arguments: [
      {
        name: 'command',
        about: 'View help for a specific command',
        example: 'add field',
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
      },
      {
        name: 'kind',
        about: 'The kind of the field, ie ID!',
        required: true,
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
    about: 'Init new graphql project',
    command: 'init',
  },
  {
    about: 'Sync project',
    command: 'sync',
  },
  {
    about: 'View type definition',
    command: 'type',
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
    command: 'types',
  },
]

export default function help(command?: string) {
  return commands
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
                  arg.spreadable ? colors.underline('...') : '',
                  colors.underline(arg.name),
                ].join('')
              )
              .join(' ')
          : ''
      )
      if (cmd.arguments) {
        console.log()
        console.log('  Arguments:')
        cmd.arguments.forEach((arg) => {
          console.log(
            colors.grey('  -'),
            colors.underline(arg.name),
            ' '.repeat(13 - arg.name.length),
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
