
import type { DocumentNode } from 'graphql'
import enhanceSchema, { getKind, getName, parseKind, ParsedType } from '@browserql/schema'

interface Options {
  useExport?: boolean
  useDeclare?: boolean
  typeSuffix?: string
}

function extract(type: string) {
  if (type === 'ID' || type === 'String') {
    return 'string'
  }
  if (type === 'Int' || type === 'Float') {
    return 'number'
  }
  if (type === 'Boolean') {
    return 'boolean'
  }
}

function parseType(type: ParsedType, schema: any, options: Options) {
  let parsed = extract(type.type)
  if (!parsed) {
    const t = schema.getType(type.type)
    if (t) {
      if (options.typeSuffix) {
        parsed = `${type.type}${options.typeSuffix}`
      }
    }
  }
  if (!parsed) {
    parsed = type.type
  }
  if (type.depth) {
    let next = parsed
    for (let i = 0; i < type.depth; i++) {
      next = `${next}[]`
    }
    return next
  }
  return parsed
}

export default function generateTypescript(
  schema: DocumentNode,
  options: Options = {}
) {
  const enhanced = enhanceSchema(schema)
  const typescripts: string[] = []
  const types = enhanced.getTypes()
  const queries = enhanced.getQueries()
  const qs: string[] = []
  const mutations = enhanced.getMutations()
  const ms: string[] = []
  for (const type of types) {
    typescripts.push(`${
      options.useExport ? 'export ' : ''
    }${
      options.useDeclare ? 'declare ' : ''
    }interface ${
      getName(type)
    }${
      options.typeSuffix || ''
    } {`)
    const { fields = [] } = type
    for (const field of fields) {
      const parsedType = parseKind(getKind(field))
      typescripts.push(`  ${
        getName(field)
      }${
        parsedType.required ? '' : '?'
      }: ${
        parseType(parsedType, enhanced, options)
      }`)
    }
    typescripts.push('}')
  }
  if (queries.length) {
    for (const query of queries) {
      const q: string[] = ['  ', getName(query)]
      const { arguments: args = [] } = query
      if (!args.length) {
        q.push('()')
      } else {
        q.push('(')
        q.push(...args.map(arg => {
          const argType = parseKind(getKind(arg))
          return `\n    ${
            getName(arg)
          }${
            argType.required ? '' : '?'
          }: ${
            parseType(argType, enhanced, options)
          },`
        }))
        q.push('\n  )')
      }
      q.push(`: Promise<${parseType(parseKind(getKind(query)), enhanced, options)}>`)
      qs.push(q.join(''))
    }
    typescripts.push(`${
      options.useExport ? 'export ' : ''
    }${
      options.useDeclare ? 'declare ' : ''
    }interface Query {`)
    typescripts.push(...qs)
    typescripts.push('}')
  }
  if (mutations.length) {
    for (const mutation of mutations) {
      const m: string[] = ['  ', getName(mutation)]
      const { arguments: args = [] } = mutation
      if (!args.length) {
        m.push('()')
      } else {
        m.push('(')
        m.push(...args.map(arg => {
          const argType = parseKind(getKind(arg))
          return `\n    ${
            getName(arg)
          }${
            argType.required ? '' : '?'
          }: ${
            parseType(argType, enhanced, options)
          },`
        }))
        m.push('\n  )')
      }
      m.push(`: Promise<${parseType(parseKind(getKind(mutation)), enhanced, options)}>`)
      ms.push(m.join(''))
    }
    typescripts.push(`${
      options.useExport ? 'export ' : ''
    }${
      options.useDeclare ? 'declare ' : ''
    }interface Mutation {`)
    typescripts.push(...ms)
    typescripts.push('}')
  }
  return typescripts.join('\n')
}
