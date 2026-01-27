import { useEffect } from 'react';
import { getApolloClient } from '@/lib/apolloClient';
import { UPDATE_USER } from '@/lib/mutations';
import { GET_CURRENT_USER } from '@/lib/queries';
import { User, UserRole, UserData } from '@/lib/types';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ReactNode, useContext, createContext } from 'react';
import { USER_UPDATED } from '@/lib/subscriptions';

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
  return { managingTablet: false };
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
      if (user && typeof user.data === 'string') {
        try {
          user.data = JSON.parse(user.data);
        } catch {
          user.data = getDefaultUserData();
        }
      } else if (user && typeof user.data !== 'object') {
        user.data = getDefaultUserData();
      }
      return user;
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
  return context;
};

// Hook pour la mutation universelle de l'utilisateur
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<User> & { data?: UserData } }) => {
      // Si input.data est un objet, sérialiser en string
      const inputToSend = { ...input };
      if (inputToSend.data && typeof inputToSend.data === 'object') {
        (inputToSend as any).data = JSON.stringify(inputToSend.data);
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
