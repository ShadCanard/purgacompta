import { pubsub } from './resolvers/_pubsub';

export const Subscription = {
  userUpdated: {
    subscribe: () => pubsub.asyncIterator(['USER_UPDATED'])
  },
  tabletUpdated: {
    subscribe: (...args: any[]) => {
      console.log('[BACKEND] Nouvelle souscription TABLET_UPDATED');
      return pubsub.asyncIterator(['TABLET_UPDATED']);
    }
  },
  storageUpdated: {
    subscribe: () => pubsub.asyncIterator(['STORAGE_UPDATED'])
  }
};
