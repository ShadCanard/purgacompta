import { rootTypeDefs } from './root.js';
import { storageTypeDefs } from './storage.js';
import { userTypeDefs } from './user.js';
import { vehicleTypeDefs } from './vehicle.js';
import { storageLocationTypeDefs } from './storageLocation.js';
import { itemTypeDefs } from './item.js';
import { contactTypeDefs } from './contact.js';
import { groupTypeDefs } from './group.js';
import { transactionTypeDefs } from './transaction.js';
import { itemPriceTypeDefs } from './itemPrice.js';
import { vehicleTransactionTypeDefs } from './vehicleTransaction.js';
import { userAccountHistoryTypeDefs } from './userAccountHistory.js';
import { dashboardTypeDefs } from './dashboard.js';

export const typeDefs = [
  rootTypeDefs,
  storageTypeDefs,
  storageLocationTypeDefs,
  userTypeDefs,
  vehicleTypeDefs,
  itemTypeDefs,
  contactTypeDefs,
  groupTypeDefs,
  transactionTypeDefs,
  itemPriceTypeDefs,
  vehicleTransactionTypeDefs,
  userAccountHistoryTypeDefs,
  dashboardTypeDefs,
].join('\n');
