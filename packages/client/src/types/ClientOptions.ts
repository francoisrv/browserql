import { Dictionary } from '../types';
import { GraphQLOperation } from './ConnectOptions';

export interface ClientOptions {
  mutations?: Dictionary<GraphQLOperation>;
  queries?: Dictionary<GraphQLOperation>;
}
