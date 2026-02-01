import prisma from '../../lib/prisma';

export const StorageLocation = {
  storages: (parent: any) =>
    prisma.storage.findMany({ where: { storageLocationId: parent.id } }),
};

export const Query = {
  storageLocations: () =>
    prisma.storageLocation.findMany({ orderBy: { createdAt: 'desc' }, include: { storages: true } }),
  storageLocationById: (_: any, { id }: { id: string }) =>
    prisma.storageLocation.findUnique({ where: { id }, include: { storages: true } }),
};

export const Mutation = {
  createStorageLocation: async (_: any, { input }: { input: { name: string } }) => {
    const exists = await prisma.storageLocation.findUnique({ where: { name: input.name } });
    if (exists) throw new Error('Un emplacement avec ce nom existe déjà');
    return prisma.storageLocation.create({ data: { name: input.name } });
  },
  updateStorageLocation: async (_: any, { id, input }: { id: string, input: { name?: string } }) => {
    return prisma.storageLocation.update({
      where: { id },
      data: { ...input },
    });
  },
  deleteStorageLocation: async (_: any, { id }: { id: string }) => {
    // Optionnel : vérifier qu'il n'y a pas de storages liés avant suppression
    return prisma.storageLocation.delete({ where: { id } });
  },
};
