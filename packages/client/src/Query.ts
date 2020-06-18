import { QueryMiddleware } from './types'
import Client from './Client'

export default class Query {
  name: string
  getClient: () => Client
  middlewares: QueryMiddleware[] = []

  constructor(name: string, getClient: () => Client) {
    this.name = name
    this.getClient = getClient
  }

  push(middleware: QueryMiddleware) {
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
