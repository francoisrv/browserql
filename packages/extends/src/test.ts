// import enhanceSchema, { getName } from '@browserql/schema'
import gql from 'graphql-tag'
// import type { DocumentNode, StringValueNode, ObjectTypeDefinitionNode } from 'graphql'

// import {  } from 'graphql'

import connectExtends from '.'

test('it should extend with one type', () => {
  const schema = gql`
  type Foo {
    a: ID !
  }

  type Bar @extends(type: "Foo") {
    b: [ ID ]
  }
  `

  // const connected = connectExtends({ schema })({})
  // const enhanced = enhanceSchema(connected.schema as DocumentNode)

  // enhanced.extend(schema)

  // console.log(enhanced.print())

  // const ast = print

  // const Bar = enhanced.get()

  // const { fields = [] } = Bar as ObjectTypeDefinitionNode

  // expect(getName(fields[0])).toEqual('b')
  // expect(getName(fields[1])).toEqual('a')
})