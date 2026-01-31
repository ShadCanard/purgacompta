import { rootTypeDefs } from './root';
import { storageTypeDefs } from './storage';
import { userTypeDefs } from './user';
import { vehicleTypeDefs } from './vehicle';
import { itemTypeDefs } from './item';
import { contactTypeDefs } from './contact';
import { groupTypeDefs } from './group';
import { transactionTypeDefs } from './transaction';
import { itemPriceTypeDefs } from './itemPrice';
import { vehicleTransactionTypeDefs } from './vehicleTransaction';
import { userAccountHistoryTypeDefs } from './userAccountHistory';
import { dashboardTypeDefs } from './dashboard';

export const typeDefs = [
  rootTypeDefs,
  storageTypeDefs,
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
