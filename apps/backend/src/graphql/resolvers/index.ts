import * as storageResolvers from './storage';
import * as contactResolvers from './contact';
import * as userResolvers from './user';
import * as transactionResolvers from './transaction';
import * as groupResolvers from './group';
import * as itemResolvers from './item';
import * as vehicleResolvers from './vehicle';
import * as logsResolvers from './logs';
import * as subscriptionResolvers from '../subscriptions';
import * as vehicleTransactionResolvers from './vehicleTransaction';
import { mergeResolvers } from '@graphql-tools/merge';

export const resolvers: Record<string, any> = mergeResolvers([
  storageResolvers,
  contactResolvers,
  userResolvers,
  transactionResolvers,
  groupResolvers,
  itemResolvers,
  vehicleResolvers,
  logsResolvers,
  subscriptionResolvers,
  vehicleTransactionResolvers,
]);
