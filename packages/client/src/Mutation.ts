import { MutationMiddleware } from './types'
import Client from './Client'

export default class Mutation {
  name: string
  getClient: () => Client
  middlewares: MutationMiddleware[] = []

  constructor(name: string, getClient: () => Client) {
    this.name = name
    this.getClient = getClient
  }

  push(middleware: MutationMiddleware) {
    this.middlewares.push(middleware)
    return this
  }

  async execute(input: any) {
    let output = input
    for (const middleware of this.middlewares) {
      output = await middleware(output, this.getClient)
    }
    return output
  }
}
