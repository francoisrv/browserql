
import { getMutations, getQueries, getTypes } from '@browserql/fpql'
import type { DocumentNode, FieldDefinitionNode } from 'graphql'
import { TSGeneratorOptions } from './types'



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

function makeFunction(query: FieldDefinitionNode, enhanced: any, options: Options) {
  const q: string[] = ['  ', getName(query)]
  const { arguments: args = [] } = query
  if (!args.length) {
    q.push('()')
  } else {
    q.push('(\n    variables: {')
    q.push(...args.map(arg => {
      const argType = parseKind(getKind(arg))
      return `\n      ${
        getName(arg)
      }${
        argType.required ? '' : '?'
      }: ${
        parseType(argType, enhanced, options)
      },`
    }))
    q.push('\n    }\n  )')
  }
  q.push(`: Promise<${parseType(parseKind(getKind(query)), enhanced, options)}>`)
  return q.join('')
}

export default function generateTypescript(
  schema: DocumentNode,
  options: TSGeneratorOptions = {}
) {
  const typescripts: string[] = []

  const types = getTypes(schema)
  const queries = getQueries(schema)
  const mutations = getMutations(schema)


  // const qs: string[] = []
  // const ms: string[] = []
  // for (const type of types) {
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
      qs.push(makeFunction(query, enhanced, options))
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
      ms.push(makeFunction(mutation, enhanced, options))
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
