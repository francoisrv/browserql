import { ResolverMiddleware } from './types'
import Client from './Client'

export default class Resolver {
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

  async execute(input: any) {
    let output = input
    for (const middleware of this.middlewares) {
      output = await middleware(output, this.getClient)
    }
    return output
  }
}