import { BrowserqlClient } from "@browserql/client";
import { getById, getOne, paginate } from "./queries";
import { Query, QueryFilters } from "./types";

export default function exportFirestore(client: BrowserqlClient) {
  return {
    async paginate(collection: string, where?: Query[], filters?: QueryFilters) {
      return client.resolved
    }
  }
}
