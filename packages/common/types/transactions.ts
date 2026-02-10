import { Group } from './groups';
import { Contact } from './contacts';
import { Item } from './items';

export interface TransactionLine {
  id: string;
  item: Item;
  quantity: number;
  unitPrice: number;
}

export interface Transaction {
  id: string;
  sourceGroup?: Group;
  targetGroup?: Group;
  targetContact?: Contact;
  blanchimentPercent: number;
  amountToBring: number;
  blanchimentAmount: number;
  totalFinal: number;
  createdAt: string;
  lines: TransactionLine[];
}
