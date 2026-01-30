import prisma from '../../lib/prisma';

export const Query = {
    vehicleTransactions: async () => {
      return prisma.vehicleTransaction.findMany({ include: { vehicle: true, item: true } });
    },
    vehicleTransaction: async (_: any, { id }: { id: string }) => {
      return prisma.vehicleTransaction.findUnique({ where: { id }, include: { vehicle: true, item: true } });
    },
  };
export const Mutation = {
    createVehicleTransaction: async (_: any, { input }: any) => {
      return prisma.vehicleTransaction.create({ data: input });
    },
    updateVehicleTransaction: async (_: any, { id, input }: any) => {
      return prisma.vehicleTransaction.update({ where: { id }, data: input });
    },
    deleteVehicleTransaction: async (_: any, { id }: { id: string }) => {
      await prisma.vehicleTransaction.delete({ where: { id } });
      return true;
    },
  };

export const VehicleTransaction = {
    vehicle: (parent: any) => prisma.vehicle.findUnique({ where: { id: parent.vehicleId } }),
    item: (parent: any) => parent.itemId ? prisma.item.findUnique({ where: { id: parent.itemId } }) : null,
};
