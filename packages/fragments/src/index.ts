import {
  DocumentNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql';
import enhanceSchema, { getKind, getName, parseKind } from '@browserql/schema';
import { Dictionary } from 'lodash';

interface Fragment {
  source: string;
  dependencies: string[];
}

function makeFragment(
  type: ObjectTypeDefinitionNode,
  fragments: Dictionary<Fragment>,
  schema: ReturnType<typeof enhanceSchema>
) {
  const name = getName(type);
  let fragment = `fragment ${name}Fragment on ${name} {`;
  const dependencies: string[] = [];
  const { fields = [] } = type;
  for (const field of fields) {
    fragment += `\n  ${getName(field)}`;
    const { type: fieldKind } = parseKind(getKind(field));
    const fieldType = schema.getType(fieldKind);
    if (fieldType && !(fieldKind in fragments)) {
      dependencies.push(fieldKind);
      makeFragment(fieldType, fragments, schema);
      fragment += ` {\n    ...${fieldKind}Fragment \n  }`;
    }
  }
  fragment += '\n}';
  fragments[name] = { source: fragment, dependencies };
}

export default function buildFragments(document: string | DocumentNode) {
  const schema = enhanceSchema(document);
  const queries = schema.getQueries();
  const mutations = schema.getMutations();
  const fragments: Dictionary<Fragment> = {};
  function buildFragment(query: FieldDefinitionNode) {
    const { type: queryKind } = parseKind(getKind(query));
    if (!fragments[queryKind]) {
      const type = schema.getType(queryKind);
      if (type) {
        makeFragment(type, fragments, schema);
      }
    }
  }
  queries.forEach(buildFragment);
  mutations.forEach(buildFragment);
  const f = {
    get(name: string): string | null {
      const fragment = fragments[name];
      if (!fragment) {
        return null;
      }
      const results: string[] = [fragment.source];
      for (const dep of fragment.dependencies) {
        results.push(fragments[dep].source);
      }
      return results.join('\n');
    },
    printAll(): string {
      const lines = Object.keys(fragments).map(f.get)
      return lines.join('\n\n')
    }
  };
  return f
}
