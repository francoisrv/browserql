import find from 'lodash.find';
import get from 'lodash.get';
import ApolloClient from 'apollo-client';
import { DocumentNode, FieldDefinitionNode } from 'graphql';
import { MutationResolver, Transaction } from './types';
import Schema from './Schema';
import { Dictionary, isArray } from 'lodash';
import Query from './Query';
import defaultValue from './defaultValue';
import gql from 'graphql-tag';
import SchemaQueries, {
  QueryTyped,
  QueryTypedSignature,
} from './Schema.queries';

class Cache<S extends Schema> {
  constructor(
    public readonly name: keyof QueryList<S['queries']>,
    public readonly variables: any,
    public readonly client: Client<S>
  ) {}

  push(data: any) {
    const array = this.client.query(this.name, this.variables);
    const nextArray = [...array, data];
    this.client.write(this.name, nextArray, this.variables);
  }
}

type QueryList<S extends SchemaQueries> = ReturnType<S['getTypedQueries']>;

type QueryVariables<Q extends QueryTypedSignature> = Q['variables'];

type QueryData<Q extends QueryTypedSignature> = Q['data'];

type ClientQuery<GenericSchema extends Schema> = (
  variables?: QueryVariables<QueryList<S['queries']>[q]>
) => QueryData<QueryList<S['queries']>[q]>;

type ClientType<S extends Schema> = {
  queries: {
    [q in keyof QueryList<S['queries']>]: (
      variables?: QueryVariables<QueryList<S['queries']>[q]>
    ) => QueryData<QueryList<S['queries']>[q]>;
  };
};

export default class Client<GenericSchema extends Schema> {
  queries: ClientType<GenericSchema>['queries'];
  mutations: any = {};
  cache: any = {};

  constructor(
    public readonly apollo: ApolloClient<any>,
    private readonly schema: Schema,
    private readonly transactions: Transaction[]
  ) {
    const queries = schema.queries.getQueries();
    const clientQueries: Partial<ClientType<S>['queries']> = {};
    for (const query of queries) {
      const name = Schema.getName(query) as keyof QueryList<S['queries']>;
      clientQueries[name] = (variables: any = {}) =>
        this.query(name, variables);
      this.cache[name] = (variables = {}) =>
        new Cache<S>(name, variables, this);
    }
    const mutations = schema.mutations.getMutations();
    for (const mutation of mutations) {
      const name = Schema.getName(mutation);
      this.mutations[name] = (variables: any = {}) =>
        this.mutate(name, variables);
    }
    this.queries = clientQueries as ClientType<S>['queries'];
  }

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

  readQuery(name: keyof QueryList<S['queries']>, variables?: any) {
    const query = find(this.transactions, { name });
    if (!query) {
      throw new Error(`Could not find query: ${name}`);
    }
    const data = this.apollo.readQuery({ query: query.node, variables });
    return data[name];
  }

  read(name: keyof QueryList<S['queries']>, variables?: any) {
    let data;
    try {
      data = this.readQuery(name, variables);
    } catch (error) {
      data = null;
    }
    if (data === null) {
      const query = this.schema.queries.getQuery(name as string);
      if (!query) {
        throw new Error(`Can not find query ${name}`);
      }
      return defaultValue(query.type);
    }
    return data;
  }

  query<D = any>(name: keyof QueryList<S['queries']>, variables?: any): D {
    return this.read(name, variables);
  }

  write<D = any>(
    name: keyof QueryList<S['queries']>,
    data: D,
    variables?: any
  ) {
    const query = find(this.transactions, { name });
    if (!query) {
      throw new Error(`Could not find query: ${name}`);
    }
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

  async mutate(name: keyof QueryList<S['queries']>, variables?: any) {
    const mutation = this.getMutation(name as string);
    if (!mutation) {
      throw new Error(`Could not find mutation: ${name}`);
    }
    await this.apollo.mutate({
      mutation,
      variables,
    });
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
    // const current = this.query(name, variables)
    // if (!isArray(current)) {
    //   throw new Error('Not an array')
    // }
    // current.push(data)
    // this.write(name, current, variables)
  }
}
