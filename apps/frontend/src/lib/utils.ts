import { User, UserRole } from '@purgacompta/common';

/**
 * Vérifie si un utilisateur a au moins le rôle requis (hiérarchie UserRole).
 * @param user Utilisateur à tester
 * @param requiredRole Rôle minimum requis
 * @returns true si l'utilisateur a le rôle ou plus, false sinon
 */
export function hasMinimumRole(user: User | null | undefined, requiredRole: UserRole): boolean {
  if (!user) return false;
  const hierarchy: Record<UserRole, number> = {
    GUEST: 0,
    MEMBER: 1,
    MANAGER: 2,
    ADMIN: 3,
    OWNER: 4,
  };
  return hierarchy[user.role] >= hierarchy[requiredRole];
}
// Fonctions utilitaires pour la gestion des montants et autres helpers

export function formatDollar(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(Number(val))) return '$0';
  return '$' + Number(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}


export function formatDisplayName(user: { username: string; data?: { alias?: string; firstName?: string; lastName?: string } } | null | undefined): string {
  if (!user) return 'Utilisateur inconnu';
  const alias = user.data?.alias;
  const firstName = user.data?.firstName;
  const lastName = user.data?.lastName;
  if (alias && alias.trim().length > 0) return alias;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  console.dir(user);
  return user.username;
}

export function formatFullName(user: { data?: { alias?: string; firstName?: string; lastName?: string } } | null | undefined): string {
  if (!user?.data?.firstName || !user?.data?.lastName) return 'inconnu';
  const { firstName, lastName, alias } = user.data;
  if (alias && alias.trim().length > 0) {
    return `${firstName} "${alias}" ${lastName}`;
  }
  return `${firstName} ${lastName}`;
}