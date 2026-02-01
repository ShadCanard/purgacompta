import prisma from '../../lib/prisma';

export const Storage = {
  storageLocation: (parent: any) => {
    if (!parent.storageLocationId) return null;
    return prisma.storageLocation.findUnique({ where: { id: parent.storageLocationId } });
  },
};

export const Query = {
  storages: async () => {
    return prisma.storage.findMany({ orderBy: { createdAt: 'desc' }, include: { items: { include: { item: true } } } });
  },
  storageById: async (_: any, { id }: { id: string }) => {
    return prisma.storage.findUnique({ where: { id }, include: { items: { include: { item: true } } } });
  },
  storagesByStorageLocationId: async (_: any, { storageLocationId }: { storageLocationId: string }) => {
    return prisma.storage.findMany({
      where: { storageLocationId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { item: true } } },
    });
  },
};

export const Mutation = {
  createStorage: async (_: any, { input }: { input: { name: string; type: string; location: string; maxWeight?: number|null; storageLocationId: string } }) => {
    // Empêche la création sans storageLocationId
    if (!input.storageLocationId) {
      throw new Error('Un emplacement (storageLocationId) est requis pour créer un stockage.');
    }
    // Vérifie l'unicité du nom par storageLocationId (clé composite)
    const exists = await prisma.storage.findFirst({
      where: {
        name: input.name,
        storageLocationId: input.storageLocationId,
      }
    });
    if (exists) throw new Error('Un stockage avec ce nom existe déjà à cet emplacement');
    return prisma.storage.create({
      data: {
        name: input.name,
        type: input.type,
        maxWeight: input.maxWeight ?? null,
        storageLocationId: input.storageLocationId,
      },
    });
  },

  updateStorage: async (_: any, { input }: { input: { storageId: string; name?: string; type?: string; maxWeight?: number|null; storageLocationId?: string|null } }) => {
    // Vérification de l'existence du Storage
    const storage = await prisma.storage.findUnique({ where: { id: input.storageId } });
    if (!storage) throw new Error('Stockage introuvable');

    // Construction de l'objet data à mettre à jour
    const data: any = {};
    if (typeof input.name === 'string') data.name = input.name;
    if (typeof input.type === 'string') data.type = input.type;
    if ('maxWeight' in input) data.maxWeight = input.maxWeight;
    if (typeof input.storageLocationId === 'string') data.storageLocationId = input.storageLocationId;

    // Mise à jour du Storage
    const updated = await prisma.storage.update({
      where: { id: input.storageId },
      data,
    });
    return updated;
  },

  updateStorageItem: async (_: any, { input }: { input: { storageItemId: string; quantity?: number } }) => {
    const storageItem = await prisma.storageItem.update({
      where: { id: input.storageItemId },
      data: {
        ...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
      },
      include: { item: true, storage: true },
    });
    return storageItem;
  },
};