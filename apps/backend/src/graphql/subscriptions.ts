import { pubsub } from "./resolvers/_pubsub.js";

// Affichage dynamique des subscriptions actives basé sur l'objet Subscription
export const Subscription = {
  userUpdated: {
    subscribe: () => {
      console.log('[BACKEND] Nouvelle souscription USER_UPDATED');
      return pubsub.asyncIterator(['USER_UPDATED']);
    }
  },
  tabletUpdated: {
    subscribe: (...args: any[]) => {
      console.log('[BACKEND] Nouvelle souscription TABLET_UPDATED');
      return pubsub.asyncIterator(['TABLET_UPDATED']);
    }
  },
  storageUpdated: {
    subscribe: () => {
      console.log('[BACKEND] Nouvelle souscription STORAGE_UPDATED');
      return pubsub.asyncIterator(['STORAGE_UPDATED']);
    }
  },
  accountUpdated: {
    subscribe : () => {
      console.log('[BACKEND] Nouvelle souscription ACCOUNT_UPDATED');
      return pubsub.asyncIterator(['ACCOUNT_UPDATED']);
    }
  }
};

console.log('[BACKEND] Subscriptions actives :', Object.keys(Subscription).join(', '));