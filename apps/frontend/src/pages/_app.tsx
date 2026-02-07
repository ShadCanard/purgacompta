import '@/styles/datagrid.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import theme from '@/styles/theme';
import { getApolloClient } from '@/lib/apolloClient';
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

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import EnvBanner from '@/components/EnvBanner';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Gestion globale des erreurs d'import de .css (ex: DataGrid)
    const errorHandler = (event: ErrorEvent) => {
      if (
        event.message?.includes('Unknown file extension ".css"') ||
        event.message?.includes('Failed to load external module') && event.message?.includes('.css')
      ) {
        router.replace('/');
      }
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, [router]);

  let env: 'DEV' | 'RECETTE' | undefined = undefined;
  if (process.env.NODE_PUBLIC_ENV === 'development') env = 'DEV';
  if (
    process.env.NODE_PUBLIC_ENV === 'test'
  ) env = 'RECETTE';

  console.dir({ env, NODE_ENV: process.env.NODE_PUBLIC_ENV });

  return (
    <SessionProvider session={session}>
      <ApolloProvider client={getApolloClient()}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserProvider>
              <SnackbarProvider>
                <Component {...pageProps} />
                <EnvBanner env={env} />
                {process.env.NODE_PUBLIC_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
              </SnackbarProvider>
            </UserProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
