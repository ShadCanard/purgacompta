import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AccountHistory } from '@purgacompta/common/types/accountHistory';
import {
    GET_USER_ACCOUNT_HISTORIES,
    GET_USER_ACCOUNT_HISTORY,
    GET_USER_ACCOUNT_HISTORIES_BY_USER,
} from '@/lib/queries/userAccountHistory';
import {
    CREATE_USER_ACCOUNT_HISTORY,
    UPDATE_USER_ACCOUNT_HISTORY,
    DELETE_USER_ACCOUNT_HISTORY,
} from '@/lib/mutations/userAccountHistory';
import { getApolloClient } from '@/lib/apolloClient';

  const apolloClient = getApolloClient();

export function useAccountHistories() {
  return useQuery<AccountHistory[]>({
    queryKey: ['user-account-histories'],
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_USER_ACCOUNT_HISTORIES });
      return (data as any).userAccountHistories;
    },
  });
}

export function useAccountHistory(id: string) {
  const apolloClient = getApolloClient();
  return useQuery<AccountHistory | undefined>({
    queryKey: ['user-account-history', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_USER_ACCOUNT_HISTORY, variables: { id } });
      return (data as any).userAccountHistory;
    },
  });
}

export function useAccountHistoriesByUser(userId: string) {
  const apolloClient = getApolloClient();
  return useQuery<AccountHistory[]>({
    queryKey: ['user-account-histories-by-user', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_USER_ACCOUNT_HISTORIES_BY_USER, variables: { userId } });
      return (data as any).userAccountHistoriesByUser;
    },
  });
}

export function useCreateAccountHistory() {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  return useMutation<AccountHistory, unknown, Omit<AccountHistory, 'id' | 'createdAt' | 'user'>>({
    mutationFn: async (input) => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_USER_ACCOUNT_HISTORY,
        variables: { input },
      });
      return (data as any).createUserAccountHistory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-account-histories']});
    },
  });
}

export function useUpdateUserAccountHistory() {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  return useMutation<AccountHistory, unknown, { id: string; input: Partial<AccountHistory> }>({
    mutationFn: async ({ id, input }) => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_USER_ACCOUNT_HISTORY,
        variables: { id, input },
      });
      return (data as any).updateUserAccountHistory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-account-histories']});
    },
  });
}

export function useDeleteUserAccountHistory() {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  return useMutation<boolean, unknown, string>({
    mutationFn: async (id) => {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_USER_ACCOUNT_HISTORY,
        variables: { id },
      });
      return (data as any).deleteUserAccountHistory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-account-histories']});
    },
  });
}
