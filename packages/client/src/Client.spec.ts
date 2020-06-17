import connect from './connect'
import gql from 'graphql-tag'

describe('Client', () => {

    describe('Query resolver', () => {

      describe('Cache access', () => {
        const client = connect({
          schema: gql`
          type Query {
            foo: String
          }
          `
        })
        it('should return null if cache is empty', () => {
          
        })
      })

    })

})