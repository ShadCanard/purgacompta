import { StorageLocation } from './storageLocations';
import { Item } from './items';

export enum StorageType {
  ARMORY = 'ARMORY',
  STORAGE = 'STORAGE',
  FRIDGE = 'FRIDGE',
}

export interface Storage {
  id: string;
  name: string;
  type: StorageType;
  maxWeight?: number;
  createdAt: string;
  updatedAt: string;
  items: StorageItem[];
  storageLocation?: StorageLocation;
}

export interface StorageItem {
  id: string;
  storage: Storage;
  item: Item;
  quantity: number;
  minQuantity: number;
}
