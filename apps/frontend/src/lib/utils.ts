/**
 * Retourne la couleur de texte optimale (#fff ou #000) selon la couleur de fond passée en paramètre (hex).
 * @param bgColor Couleur de fond (ex: #f35050)
 * @returns '#fff' ou '#000'
 */
export function getContrastTextColor(bgColor: string): '#fff' | '#000' {
  // Nettoie le code couleur
  let color = bgColor.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map((c) => c + c).join('');
  }
  if (color.length !== 6) return '#000';
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  // Calcul de la luminance relative (formule WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000' : '#fff';
}
/**
 * Retourne le statut d'une date par rapport à la date actuelle :
 * - 'upcoming' : la date est dans le futur
 * - 'ongoing' : la date est aujourd'hui mais pas encore terminée
 * - 'past' : la date est dépassée et on est un jour différent
 * @param date Date à tester (string, number ou Date)
 * @returns 'upcoming' | 'ongoing' | 'past'
 */
export function getDateStatus(date: string | number | Date): 'upcoming' | 'ongoing' | 'past' {
  const now = new Date();
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'past';
  // Si la date est dans le futur
  if (d.getTime() > now.getTime()) return 'upcoming';
  // Si la date est aujourd'hui
  const isSameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (isSameDay) return 'ongoing';
  // Sinon, la date est dépassée
  return 'past';
}
// Parse une date (timestamp string/number ou ISO) en timestamp (ms) ou retourne NaN
export function parseDateTime(date: string | number | null | undefined): number {
  if (date === null || date === undefined) return NaN;
  if (typeof date === 'number') return date;
  if (typeof date === 'string') {
    if (/^\d+$/.test(date)) return Number(date);
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) return parsed;
  }
  return NaN;
}
import { User, UserRole } from '@purgacompta/common/types/user';

// Formatage date ISO ou timestamp (ms) en JJ/MM/YYYY HH:mm
export function formatDateTime(date: string | number | null | undefined): string {
  if (date === null || date === undefined) return '';
  let d: Date;
  if (typeof date === 'number') {
    d = new Date(date);
  } else if (/^\d+$/.test(date)) {
    // chaîne numérique (timestamp)
    d = new Date(Number(date));
  } else {
    d = new Date(date);
  }
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
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