import prisma from '../../lib/prisma';
import { pubsub } from './_pubsub';

export const Storage = {
  // Ajoute ici les resolvers de type Storage si besoin
};

export const Query = {
  storages: async () => {
    return prisma.storage.findMany({ orderBy: { createdAt: 'desc' }, include: { items: { include: { item: true } } } });
  },
  storageById: async (_: any, { id }: { id: string }) => {
    return prisma.storage.findUnique({ where: { id }, include: { items: { include: { item: true } } } });
  },
};

export const Mutation = {
  createStorage: async (_: any, { input }: { input: { name: string; type: string; location: string; maxWeight?: number|null } }) => {
    const exists = await prisma.storage.findUnique({ where: { name: input.name } });
    if (exists) throw new Error('Un stockage avec ce nom existe déjà');
    return prisma.storage.create({
      data: {
        name: input.name,
        type: input.type,
        location: input.location,
        maxWeight: input.maxWeight ?? null,
      },
    });
  },
  updateStorage: async (_: any, { input }: { input: { storageId: string; itemId: string; quantity: number } }) => {
    const storage = await prisma.storage.findUnique({ where: { id: input.storageId } });
    if (!storage) throw new Error('Stockage introuvable');
    const item = await prisma.item.findUnique({ where: { id: input.itemId } });
    if (!item) throw new Error('Item introuvable');
    if (storage.type === 'ARMURERIE' && !item.weapon) {
      throw new Error('Seules les armes peuvent être ajoutées à une armurerie');
    }
    if (storage.type === 'STOCKAGE' && item.weapon) {
      throw new Error('Les armes ne peuvent pas être stockées dans un stockage classique');
    }
    let result;
    const existing = await prisma.storageItem.findUnique({ where: { storageId_itemId: { storageId: input.storageId, itemId: input.itemId } } });
    if (existing) {
      result = await prisma.storageItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + input.quantity } });
    } else {
      result = await prisma.storageItem.create({ data: { storageId: input.storageId, itemId: input.itemId, quantity: input.quantity } });
    }
    await pubsub.publish('STORAGE_UPDATED', { storageUpdated: { storageId: input.storageId } });
    return result;
  },
};

