

import * as itemResolvers from './item.js';
import * as dashboardResolvers from './dashboard.js';
import { mergeResolvers } from '@graphql-tools/merge';
import * as storageLocationResolvers from './storageLocation.js';
import * as storageResolvers from './storage.js';
import * as contactResolvers from './contact.js';
import * as userResolvers from './user.js';
import * as transactionResolvers from './transaction.js';
import * as groupResolvers from './group.js';
import * as vehicleResolvers from './vehicle.js';
import * as subscriptionResolvers from '../subscriptions.js';
import * as vehicleTransactionResolvers from './vehicleTransaction.js';
import * as userAccountHistoryResolvers from './userAccountHistory.js';


export const resolvers: Record<string, any> = mergeResolvers([
  storageResolvers,
  contactResolvers,
  userResolvers,
  transactionResolvers,
  groupResolvers,
  vehicleResolvers,
  subscriptionResolvers,
  vehicleTransactionResolvers,
  userAccountHistoryResolvers,
  dashboardResolvers,
  storageLocationResolvers,
  itemResolvers,
]);

