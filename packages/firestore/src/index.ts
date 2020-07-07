import { Plugin, Client } from '@browserql/client'
import buildSchema from './buildSchema'
import Collection from './Collection'

export function plugin(db: any): Plugin {
  return function(ctx) {
    buildSchema(ctx.schema)
    return {}
  }
}

export function connect(client: Client, db: any) {
  return {
    collection(name: string) {
      return new Collection(name, db, client)
    }
  }
}
