import { User, UserData } from '@purgacompta/common';

export interface Item {
  id: string;
  name: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
  sellable: boolean;
  weapon: boolean;
}

export interface CreateItemInput {
  name: string;
  weight: number;
  sellable: boolean;
  weapon: boolean;
}

export interface UpdateItemInput {
  id: string;
  name?: string;
  weight?: number;
  sellable?: boolean;
  weapon?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  group?: Group;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CreateContactInput {
  name: string;
  phone: string;
  groupId?: string;
  notes?: string;
}

export interface UpdateContactInput {
  id: string;
  name?: string;
  phone?: string;
  groupId?: string;
  notes?: string;
}

export interface Group {
  id: string;
  name: string;
  tag?: string;
  description?: string;
  color1?: string;
  color2?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateGroupInput {
  id: string;
  name?: string;
  tag?: string;
  description?: string;
  color1?: string;
  color2?: string;
  isActive?: boolean;
}

export interface Log {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  user: User;
  diff?: string;
  createdAt: string;
}

 
// Log and LogFilterInput interfaces removed

// Utiliser User de la librairie commune

export interface RegisterUserInput {
  discordId: string;
  username: string;
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  data?: UserData;
}


export interface ItemPrice {
  id: string;
  item: Item;
  group: Group;
  targetId?: string;
  targetGroup?: Group;
  targetContact?: Contact;
  price: number;
  createdAt: string;
  updatedAt: string;
  onSell: boolean;
  buying: boolean;
}

export interface CreateItemPriceInput {
  itemId: string;
  groupId: string;
  targetId?: string;
  price: number;
  onSell?: boolean;
  buying?: boolean;
}

export interface UpdateItemPriceInput {
  id: string;
  price?: number;
  onSell?: boolean;
  buying?: boolean;
}

export interface ImportContactInput {
  display: string;
  number: string;
}

