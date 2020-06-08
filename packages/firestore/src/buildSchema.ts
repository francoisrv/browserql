import { Schema } from '@browserql/client'

export default function buildSchema(schema: Schema): void {
  schema.addDirective({
    name: 'firestore',
    locations: { type: true },
    arguments: [
      {
        name: 'collection',
        kind: 'String'
      }
    ]
  })

  const types = schema.getTypesWithDirective('firestore')

  for (const type of types) {
    const typeName = Schema.getName(type)
    const findName = `firestoreFind${ typeName }`
    schema.addQuery({
      name: findName,
      kind: `[ ${ typeName } ]`
    })
  }
}