import prisma from '../../lib/prisma.js';
import { VehicleTransactionInput } from '@purgacompta/common/types/vehicleTransactions';
import { pubsub } from './_pubsub.js';

export const Query = {
    vehicleTransactions: async () => {
      return prisma.vehicleTransaction.findMany({ include: { vehicle: true, item: true } });
    },
    vehicleTransaction: async (_: any, { id }: { id: string }) => {
      return prisma.vehicleTransaction.findUnique({ where: { id }, include: { vehicle: true, item: true } });
    },
    vehicleTransactionsByTarget: async (_: any, { targetId }: { targetId: string }) => {
      return prisma.vehicleTransaction.findMany({
        where: { targetId },
        include: { vehicle: true, item: true },
      });
    },
  };
export const Mutation = {
    createVehicleTransaction: async (_: any, { input }: { input: VehicleTransactionInput }) => {
      const vehicleUser = await prisma.vehicleUser.findUnique({ where: { id: input.vehicleUserId } });

      if (!vehicleUser) {
        throw new Error('Vehicle user not found');
      }

      const transaction = await prisma.vehicleTransaction.create({ data: {
        isDirtyMoney: input.isDirtyMoney,
        isMoney: input.isMoney,
        rewardAmount: input.rewardAmount,
        vehicleId: vehicleUser.vehicleId!,
        itemId: input.itemId,
        targetId: input.targetId,
      } });

      if(transaction) {
        //Suppression du véhicule en attente dans vehicleUser une fois la transaction effectuée
        const update = await prisma.vehicleUser.update({
          where: { id: input.vehicleUserId },
          data: {
            vehicleId: null,
            found: false,
          },
          });
        await pubsub.publish("TABLET_UPDATED", { tabletUpdated: update });
      }

      return transaction;
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
    targetGroup: (parent: any) => parent.targetId ? prisma.group.findUnique({ where: { id: parent.targetId } }) : null,
    targetContact: (parent: any) => parent.targetId ? prisma.contact.findUnique({ where: { id: parent.targetId } }) : null,
      
};
