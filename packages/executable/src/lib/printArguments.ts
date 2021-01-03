type PrintArgumentsVariant =
  | { variant: 'define' }
  | { variant: 'assign'; assignments?: Record<string, string> }

type PrintArgumentsOptions = PrintArgumentsVariant | {}

/**
 * Print an object generated by buildArguments
 * @param {Record<string, string>} args An object generated by `buildArguments`
 * @param {number = 0} tab Optional -- indentation width
 * @example printArguments({ id: 'ID!' }) // "id: ID!"
 */
export default function printArguments(
  args: Record<string, string>,
  tab = 0,
  options: PrintArgumentsOptions = {}
): string {
  return Object.keys(args)
    .map((field) => {
      if ('variant' in options) {
        if (options.variant === 'define') {
          return `${` `.repeat(tab)}$${field}: ${args[field]}`
        }
        if (options.variant === 'assign') {
          if (options.assignments && field in options.assignments) {
            return `${` `.repeat(tab)}${field}: $${options.assignments[field]}`
          }
          return `${` `.repeat(tab)}${field}: $${field}`
        }
      }
      return `${` `.repeat(tab)}${field}: ${args[field]}`
    })
    .join('\n')
}
