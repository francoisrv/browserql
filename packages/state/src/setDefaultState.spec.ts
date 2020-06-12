import { Schema } from "@browserql/client"
import setDefaultState from "./setDefaultState"


describe('Set default state', () => {
  it('should return initial state', () => {
    const schema = new Schema(`
    type State @state {
      foo: String @initialState(value: "foo")
    }
    `)
    const [foo] = schema.getTypeFields('State')
    const value = setDefaultState(foo, null)
    expect(value).toEqual('foo')
  })
  it('should return callback', () => {
    const schema = new Schema(`
    type State @state {
      foo: Int
    }
    `)
    const [foo] = schema.getTypeFields('State')
    const value = setDefaultState(foo, 22)
    expect(value).toEqual(22)
  })
})