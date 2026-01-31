import { GET_USER_BY_ID } from '@/lib/queries/users';
import { GET_CURRENT_USER, GET_MEMBERS } from '@/lib/queries/users';
// Hook pour récupérer la liste des membres (users)
import { getApolloClient } from '@/lib/apolloClient';
import { UPDATE_USER } from '@/lib/mutations/users';
import { User, UserRole, UserData } from '@purgacompta/common';
import { useQuery as useRQ, useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, ReactNode, useContext, createContext } from 'react';
import { USER_UPDATED } from '@/lib/subscriptions/user';

export function useUserById(userId: string | undefined) {
  return useRQ<User>({
    queryKey: ['user-by-id', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error('userId is undefined');
      const apolloClient = getApolloClient();
      const { data } = await apolloClient.query({ query: GET_USER_BY_ID, variables: { id: userId }, fetchPolicy: 'network-only' });
      return (data as any).userById;
    }
  });
}

export function useMembers() {
  return useRQ<User[]>({
    queryKey: ['members-list'],
    queryFn: async () => {
      const apolloClient = getApolloClient();
      const { data } = await apolloClient.query({ query: GET_MEMBERS });
      return (data as any).users || [];
    },
  });
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  hasPermission: (role: UserRole) => boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const UserContext = createContext<UserContextType | null>(null);
function getDefaultUserData(): UserData {
  return { manageTablet: false };
}

const roleHierarchy: Record<UserRole, number> = {
  GUEST: 0,
  MEMBER: 1,
  MANAGER: 2,
  ADMIN: 3,
  OWNER: 4,
};

const rolePermissions: Record<UserRole, { create: boolean; read: boolean; update: boolean; delete: boolean }> = {
  GUEST: { create: false, read: true, update: false, delete: false },
  MEMBER: { create: true, read: true, update: false, delete: false },
  MANAGER: { create: true, read: true, update: true, delete: false },
  ADMIN: { create: true, read: true, update: true, delete: true },
  OWNER: { create: true, read: true, update: true, delete: true },
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const discordId = (session?.user as any)?.discordId;
    const queryClient = useQueryClient();

  useEffect(() => {
    if (!discordId) return;
    const apolloClient = getApolloClient();
    const sub = apolloClient.subscribe({ query: USER_UPDATED }).subscribe({
      next: (result: any) => {
        const { data } = result;
        if (data?.userUpdated?.discordId === discordId) {
          queryClient.invalidateQueries({ queryKey: ['currentUser', discordId] });
        }
      },
      error: () => {},
    });
    return () => sub.unsubscribe();
  }, [discordId, queryClient]);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['currentUser', discordId],
    queryFn: async () => {
      if (!discordId) return null;
      const apolloClient = getApolloClient();
      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER,
        variables: { discordId },
        fetchPolicy: 'network-only',
      });
      const user = (data as any).user as User | null;
      if (!user) return null;
      // Toujours cloner l’objet pour éviter l’erreur "data is read-only"
      let safeUser = { ...user };
      if (typeof safeUser.data === 'string') {
        try {
          safeUser.data = JSON.parse(safeUser.data);
        } catch {
          safeUser.data = getDefaultUserData();
        }
      } else if (typeof safeUser.data !== 'object') {
        safeUser.data = getDefaultUserData();
      }
      return safeUser;
    },
    enabled: !!discordId,
    refetchOnWindowFocus: false,
  });

  const user = data ?? null;
  const loading = status === 'loading' || isLoading;
  const queryError = error instanceof Error ? error : error ? new Error('Erreur inconnue') : null;

  const hasPermission = (requiredRole: UserRole): boolean =>
    !!user && roleHierarchy[user.role] >= roleHierarchy[requiredRole];

  const currentPermissions = user ? rolePermissions[user.role] : rolePermissions.GUEST;

  const value: UserContextType = {
    user,
    loading,
    error: queryError,
    refetch,
    hasPermission,
    canCreate: currentPermissions.create,
    canRead: currentPermissions.read,
    canUpdate: currentPermissions.update,
    canDelete: currentPermissions.delete,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook pour accéder au contexte utilisateur
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

// Hook pour la mutation universelle de l'utilisateur
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<User> & { data?: UserData } }) => {
      // Filtrer __typename de data pour éviter l'erreur GraphQL
      let inputToSend = { ...input };
      if (inputToSend.data && typeof inputToSend.data === 'object') {
        const { __typename, ...rest } = inputToSend.data as any;
        inputToSend.data = rest;
      }
      const apolloClient = getApolloClient();
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_USER,
        variables: { id, input: inputToSend },
      });
      return (data as any).updateUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
export default UserProvider;
