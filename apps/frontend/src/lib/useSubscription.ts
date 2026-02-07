import { useEffect, useRef, useState } from 'react';
import { getApolloClient } from '@/lib/apolloClient';
import { DocumentNode } from 'graphql';

/**
 * Hook générique pour gérer une subscription Apollo côté frontend.
 * @param query DocumentNode de la subscription (ex: USER_UPDATED)
 * @param onData Callback appelé à chaque réception de données (data: any)
 * @returns lastValue : la dernière valeur reçue (pour déclencher un useEffect)
 */
export function useSubscription<T = any>(query: DocumentNode, onData?: (data: T) => void): T | null {
  const [lastValue, setLastValue] = useState<T | null>(null);
  const apolloClient = getApolloClient();
  const subRef = useRef<any>(null);

  useEffect(() => {
    subRef.current = apolloClient.subscribe({ query }).subscribe({
      next: (result: any) => {
        const payload = result?.data ? Object.values(result.data)[0] : undefined;
        setLastValue((payload ?? null) as T | null);
        if (onData && payload) onData(payload as T);
      },
      error: (err: any) => {
        console.error('[WS][SUB] Erreur subscription', err);
      },
      complete: () => {
      },
    });
    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apolloClient, query]);

  return lastValue;
}
