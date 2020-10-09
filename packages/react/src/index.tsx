import { ApolloProvider, DocumentNode } from '@apollo/client';
import connect from '@browserql/client';
import React from 'react';

interface Props {
  client?: any
  schema?: DocumentNode | string
}

export default function BrowserqlProvider(props: React.PropsWithChildren<Props>) {
  if (props.client) {
    return (
      <ApolloProvider client={props.client.client}>
        {props.children}
      </ApolloProvider>
    )
  }
  if (props.schema) {
    const { client } = connect({ schema: props.schema })
    return (
      // @ts-ignore
      <ApolloProvider client={client}>
        {props.children}
      </ApolloProvider>
    )
  }
}
