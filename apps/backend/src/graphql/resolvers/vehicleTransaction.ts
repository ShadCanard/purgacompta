import { PrismaClient } from '../../lib/prisma';

const prisma = new PrismaClient();

export const vehicleTransactionResolvers = {
  Query: {
    vehicleTransactions: async () => {
      return prisma.vehicleTransaction.findMany({ include: { vehicle: true, item: true } });
    },
    vehicleTransaction: async (_: any, { id }: { id: string }) => {
      return prisma.vehicleTransaction.findUnique({ where: { id }, include: { vehicle: true, item: true } });
    },
  },
  Mutation: {
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
  },
  VehicleTransaction: {
    vehicle: (parent: any) => prisma.vehicle.findUnique({ where: { id: parent.vehicleId } }),
    item: (parent: any) => parent.itemId ? prisma.item.findUnique({ where: { id: parent.itemId } }) : null,
  },
};
