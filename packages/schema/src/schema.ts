import { DocumentNode, print } from 'graphql'
import gql from 'graphql-tag'

import extend from './lib/extend'
import getByName from './lib/getByName'
import getExtendedQueries from './lib/getExtendedQueries'
import getMutation from './lib/getMutation'
import getMutations, {
  Options as GetMutationsOptions,
} from './lib/getMutations'
import getQueries, { Options as GetQueriesOptions } from './lib/getQueries'
import getQueryByName from './lib/getQueryByName'
import getType from './lib/getType'
import getTypes from './lib/getTypes'

class Schema {
  private readonly document: DocumentNode

  constructor(schema: string | DocumentNode) {
    this.document = typeof schema === 'string' ? gql(schema) : schema
  }

  get() {
    return this.document
  }

  print() {
    return print(this.document)
  }

  extend(document: string | DocumentNode) {
    return extend(this.document, document)
  }

  getExtendedQueries() {
    return getExtendedQueries(this.document)
  }

  getQueries(options: GetQueriesOptions = {}) {
    return getQueries(this.document, options)
  }
  
  getQuery(name: string) {
    return getQueryByName(this.document, name)
  }
  
  getTypes() {
    return getTypes(this.document)
  }
  
  getByName(name: string) {
    return getByName(this.document, name)
  }
  
  getType(name: string) {
    return getType(this.document, name)
  }
  
  getMutations(options: GetMutationsOptions = {}) {
    return getMutations(this.document, options)
  }
  
  getMutation(name: string) {
    return getMutation(this.document, name)
  }
}

export default function enhanceSchema(schema: string | DocumentNode) {
  return new Schema(schema)
}
