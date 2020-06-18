import { ResolverMiddleware } from './types'
import Client from './Client'

export default class Query {
  name: string
  getClient: () => Client
  middlewares: ResolverMiddleware[] = []

  constructor(name: string, getClient: () => Client) {
    this.name = name
    this.getClient = getClient
  }

  push(middleware: ResolverMiddleware) {
    this.middlewares.push(middleware)
    return this
  }

  execute(input: any) {
    let output = input
    for (const middleware of this.middlewares) {
      output = middleware(output, this.getClient)
    }
    return output
  }
}
