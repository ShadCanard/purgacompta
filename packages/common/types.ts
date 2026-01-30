// Librairie commune pour types, interfaces et enums partagés

// Exemple d'enum partagé
export enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export interface UserData {
  firstName?: string;
  lastName?: string;
  alias?: string;
  balance?: number;
  maxBalance?: number;
  isOnline?: boolean;
  manageTablet?: boolean;
  tabletUsername?: string;
  phone?: string;
}

// Exemple d'interface User complète (hors champs sensibles)
export interface User {
  id: string;
  discordId: string;
  username: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  data?: UserData;
}


export interface VehicleUser {
  id: string;
  found: boolean;
  vehicle?: Vehicle;
  user?: User;
}

export interface Vehicle {
  id: string;
  name: string;
  front: string;
  back: string;
}