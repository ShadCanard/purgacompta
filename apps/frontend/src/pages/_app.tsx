import '@/styles/datagrid.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import theme from '@/styles/theme';
import apolloClient from '@/lib/apolloClient';
import { UserProvider } from '@/providers/UserProvider';
import { SnackbarProvider } from '@/providers';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserProvider>
              <SnackbarProvider>
                <Component {...pageProps} />
                {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
              </SnackbarProvider>
            </UserProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
