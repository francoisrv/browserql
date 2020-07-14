import connect from '@browserql/client/dist/connect'
import gql from 'graphql-tag'
import plugin from '.'

describe('Model', () => {
  it('should work', () => {
    const schema = gql`
    type Todo @model {
      name: String!
    }
    `
    const client = connect({
      schema,
      plugins: [
        plugin()
      ]
    })
  })
})