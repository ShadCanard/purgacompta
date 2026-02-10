import { Group } from './groups';
export interface Contact {
  id: string;
  name: string;
  phone: string;
  group?: Group;
  groupid?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}