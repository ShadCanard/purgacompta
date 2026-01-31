
import * as storageResolvers from './storage';
import * as contactResolvers from './contact';
import * as userResolvers from './user';
import * as transactionResolvers from './transaction';
import * as groupResolvers from './group';
import * as vehicleResolvers from './vehicle';
import * as subscriptionResolvers from '../subscriptions';
import * as vehicleTransactionResolvers from './vehicleTransaction';
import * as userAccountHistoryResolvers from './userAccountHistory';

import * as dashboardResolvers from './dashboard';
import { mergeResolvers } from '@graphql-tools/merge';

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
]);
