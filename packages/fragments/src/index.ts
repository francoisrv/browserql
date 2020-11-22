import {
  DocumentNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'
import { Dictionary } from 'lodash'
import {
  getKind,
  getMutations,
  getName,
  getQueries,
  getType,
  parseKind,
} from '@browserql/fpql'

interface Fragment {
  source: string
  dependencies: string[]
}

function makeFragment(
  type: ObjectTypeDefinitionNode | ObjectTypeExtensionNode,
  fragments: Dictionary<Fragment>,
  schema: DocumentNode
) {
  const name = getName(type)
  let fragment = `fragment ${name}Fragment on ${name} {`
  const dependencies: string[] = []
  const { fields = [] } = type
  for (const field of fields) {
    fragment += `\n  ${getName(field)}`
    const { type: fieldKind } = parseKind(getKind(field))
    const fieldType = getType(fieldKind)(schema)
    if (fieldType) {
      dependencies.push(fieldKind)
      fragment += ` {\n    ...${fieldKind}Fragment \n  }`
      if (!(fieldKind in fragments)) {
        makeFragment(fieldType, fragments, schema)
      }
    }
  }
  fragment += `\n  __typename`
  fragment += '\n}'
  fragments[name] = { source: fragment, dependencies }
}

function getNetwork(
  fragment: Fragment,
  fragments: Dictionary<Fragment>,
  mem: string[]
) {
  const results: string[] = [fragment.source]
  for (const depName of fragment.dependencies) {
    if (mem.indexOf(depName) === -1) {
      mem.push(depName)
      const dep = fragments[depName]
      results.push(getNetwork(dep, fragments, mem))
    }
  }
  return results.join('\n')
}

export default function buildFragments(document: string | DocumentNode) {
  const queries = getQueries(document)
  const mutations = getMutations(document)
  const fragments: Dictionary<Fragment> = {}
  function buildFragment(query: FieldDefinitionNode) {
    const { type: queryKind } = parseKind(getKind(query))
    if (!fragments[queryKind]) {
      const type = getType(queryKind)(document)
      if (type) {
        // @ts-ignore
        makeFragment(type, fragments, document)
      }
    }
  }
  queries.forEach(buildFragment)
  mutations.forEach(buildFragment)
  const f = {
    get(name: string): string | null {
      const fragment = fragments[name]
      if (!fragment) {
        return null
      }
      return getNetwork(fragment, fragments, [name])
    },
    printAll(): string {
      const lines = Object.keys(fragments).map(f.get)
      return lines.join('\n\n')
    },
  }
  return f
}
