import { ResolverMiddleware } from './types'

export default class Resolver {
  name: string
  middlewares: ResolverMiddleware[] = []

  constructor(name: string) {
    this.name = name
  }

  push(middleware: ResolverMiddleware) {
    this.middlewares.push(middleware)
  }

  async execute(input: any) {
    let output = input
    for (const middleware of this.middlewares) {
      output = await middleware(output)
    }
    return output
  }
}