import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';


let apolloClient: ApolloClient<any> | null = null;

export function getApolloClient() {
  if (apolloClient) return apolloClient;

  const httpUri = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
  const wsUri = httpUri.replace(/^http/, 'ws');

  const httpLink = createHttpLink({ uri: httpUri });

  const authLink = setContext(async (_, { headers }) => {
    let token = null;
    if (typeof window !== 'undefined') {
      const session = await getSession();
      token = session?.user?.purgatoryJwt || null;
    }
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  let link = authLink.concat(httpLink);
  if (typeof window !== 'undefined') {
    const wsClient = createClient({
      url: wsUri,
      connectionParams: async () => {
        let token = null;
        const session = await getSession();
        token = session?.user?.purgatoryJwt || null;
        return {
          headers: {
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      },
      on: {
        error: (err) => console.error('[APOLLO][WS] Erreur WebSocket GraphQL', err),
      },
    });
    const wsLink = new GraphQLWsLink(wsClient);
    link = split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return (
          def.kind === 'OperationDefinition' &&
          def.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink)
    );
  }

  apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
  return apolloClient;
}
