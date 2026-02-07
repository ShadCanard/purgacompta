import prisma from '../../lib/prisma';

import { UserData } from '@purgacompta/common/types/user';
import { pubsub } from './_pubsub';

export const Query = {
  userAccountHistories: async () => {
    const histories = await prisma.userAccountHistory.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    return histories.map(h => ({
      ...h,
      user: h.user ? { ...h.user, data: h.user.data ? JSON.parse(h.user.data) as UserData : undefined } : null
    }));
  },
  userAccountHistory: async (_: any, { id }: { id: string }) => {
    const h = await prisma.userAccountHistory.findUnique({ where: { id }, include: { user: true } });
    if (!h) return null;
    return {
      ...h,
      user: h.user ? { ...h.user, data: h.user.data ? JSON.parse(h.user.data) as UserData : undefined } : null
    };
  },
  userAccountHistoriesByUser: async (_: any, { userId }: { userId: string }) => {
    const histories = await prisma.userAccountHistory.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    return histories.map(h => ({
      ...h,
      user: h.user ? { ...h.user, data: h.user.data ? JSON.parse(h.user.data) as UserData : undefined } : null
    }));
  },
};

export const Mutation = {
  createUserAccountHistory: async (_: any, { input }: any) => {
    // Création de l'historique
    const newAccount = await prisma.userAccountHistory.create({ data: input });

    // Récupération de l'utilisateur
    const user = await prisma.user.findUnique({ where: { id: input.userId } });
    if (user) {
      // Mise à jour du balance dans user.data
      let userData: UserData = user.data ? JSON.parse(user.data) : {};
      userData.balance = input.amount;
      await prisma.user.update({
        where: { id: input.userId },
        data: { data: JSON.stringify(userData) }
      });
    }

    pubsub.publish('ACCOUNT_UPDATED', { accountUpdated: newAccount });
    pubsub.publish('USER_UPDATED', { userUpdated: user });
    return newAccount;
  },
  updateUserAccountHistory: async (_: any, { id, input }: any) => {
    return prisma.userAccountHistory.update({ where: { id }, data: input });
  },
  deleteUserAccountHistory: async (_: any, { id }: { id: string }) => {
    await prisma.userAccountHistory.delete({ where: { id } });
    return true;
  }
};
