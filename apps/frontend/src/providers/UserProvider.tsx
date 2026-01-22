import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';

// Types pour l'utilisateur
export type UserRole = 'GUEST' | 'MEMBER' | 'MANAGER' | 'ADMIN' | 'OWNER';

export interface User {
  id: string;
  discordId: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  isOnline?: boolean;
  balance?: number;
  maxBalance?: number;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

// Hiérarchie des rôles pour les permissions
const roleHierarchy: Record<UserRole, number> = {
  GUEST: 0,
  MEMBER: 1,
  MANAGER: 2,
  ADMIN: 3,
  OWNER: 4,
};

// Permissions CRUD par rôle
const rolePermissions: Record<UserRole, { create: boolean; read: boolean; update: boolean; delete: boolean }> = {
  GUEST: { create: false, read: true, update: false, delete: false },
  MEMBER: { create: true, read: true, update: false, delete: false },
  MANAGER: { create: true, read: true, update: true, delete: false },
  ADMIN: { create: true, read: true, update: true, delete: true },
  OWNER: { create: true, read: true, update: true, delete: true },
};

// Query GraphQL pour récupérer l'utilisateur connecté
const GET_CURRENT_USER = gql`
  query GetCurrentUser($discordId: String!) {
    user(discordId: $discordId) {
      id
      discordId
      username
      name
      email
      avatar
      role
      createdAt
      updatedAt
      isOnline
      balance
      maxBalance
    }
  }
`;

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const discordId = (session?.user as any)?.discordId;

  // Utilisation de TanStack Query pour récupérer l'utilisateur
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useTanstackQuery({
    queryKey: ['currentUser', discordId],
    queryFn: async () => {
      if (!discordId) return null;
      const result = await (apolloClient as ApolloClient<NormalizedCacheObject>).query({
        query: GET_CURRENT_USER,
        variables: { discordId },
        fetchPolicy: 'network-only',
      });
      return result.data.user as User;
    },
    enabled: !!discordId,
    refetchOnWindowFocus: false,
  });

  const user = data ?? null;
  const loading = status === 'loading' || isLoading;
  const queryError = error instanceof Error ? error : error ? new Error('Erreur inconnue') : null;

  // Vérifier si l'utilisateur a au moins le rôle requis
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  // Permissions CRUD basées sur le rôle
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

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;
