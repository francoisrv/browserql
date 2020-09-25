import find from 'lodash.find';
import get from 'lodash.get';
import ApolloClient from 'apollo-client';
import { DocumentNode } from 'graphql';
import { MutationResolver, Transaction } from './types';
import Schema from './Schema';
import { Dictionary, isArray } from 'lodash';
import Query from './Query';
import defaultValue from './defaultValue';
import gql from 'graphql-tag';

export default class Client {
  constructor(
    public readonly apollo: ApolloClient<any>,
    private readonly schema: Schema,
    private readonly transactions: Transaction[],
    public readonly mutations: Dictionary<MutationResolver>
  ) {}

  // SCHEMA

  printSchema() {
    return this.schema.toString();
  }

  getSchema() {
    return this.schema;
  }

  // TRANSACTIONS

  getTransaction(name: string): Transaction | undefined {
    return find(this.transactions, { name });
  }

  // QUERY

  readQuery(name: string, variables?: any) {
    const query = find(this.transactions, { name });
    if (!query) {
      throw new Error(`Could not find query: ${name}`);
    }
    const data = this.apollo.readQuery({ query: query.node, variables });
    return data[name];
  }

  read(name: string, variables?: any) {
    let data;
    try {
      data = this.readQuery(name, variables);
    } catch (error) {
      data = null;
    }
    if (data === null) {
      const query = this.schema.queries.getQuery(name);
      if (!query) {
        throw new Error(`Can not find query ${name}`);
      }
      return defaultValue(query.type);
    }
    return data;
  }

  query(name: string, variables?: any) {
    return this.read(name, variables);
  }

  write(name: string, data: any, variables?: any) {
    const query = find(this.transactions, { name });
    if (!query) {
      throw new Error(`Could not find query: ${name}`);
    }
    console.log('query!', query);
    return this.apollo.writeQuery({
      query: query.node,
      variables,
      data: { [name]: data },
    });
  }

  // MUTATION

  getMutation(name: string): DocumentNode | undefined {
    const mutation = find(this.transactions, { name });
    if (mutation) {
      return mutation.node;
    }
    return undefined;
  }

  async mutate(name: string, variables?: any) {
    const mutation = this.getMutation(name);
    if (!mutation) {
      throw new Error(`Could not find mutation: ${name}`);
    }
    await this.apollo.mutate({
      mutation,
      variables,
    });
  }

  // CONTEXT

  getContext(path?: string) {
    if (path) {
      return get(this.context, path);
    }
    return this.context;
  }

  // TRANSACTIONS

  getTransactions() {
    return this.transactions;
  }

  // DATA

  mergeData(name: string, data: any, variables?: any) {
    const x = this.apollo.readFragment({
      id: data.id,
      fragment: gql`
        fragment browserqlFragment_Foo on Foo {
          id
          name
          __typename
        }
      `,
    });
    console.log({ x });
    // const current = this.query(name, variables)
    // if (!isArray(current)) {
    //   throw new Error('Not an array')
    // }
    // current.push(data)
    // this.write(name, current, variables)
  }
}
