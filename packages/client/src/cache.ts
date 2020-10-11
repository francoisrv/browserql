import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

export default function makeCache() {
  return new InMemoryCache({
    addTypename: true,
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [],
        },
      },
    }),
  })
}