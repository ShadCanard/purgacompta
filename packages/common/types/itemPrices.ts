import { Item } from './items';
import { Group } from './groups';
import { Contact } from './contacts';

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
