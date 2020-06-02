import Client from "./Client";
import { DocumentNode } from "graphql";

export default class Cache {
  constructor(
    private client: Client
  ) {}

  getQuery(query: DocumentNode, variables?: any) {
    return this.client.apollo.readQuery({ query, variables })
  }

  getQueryByName(name: string, variables?: any) {
    const query = this.client.getQuery(name, variables)
  }
}