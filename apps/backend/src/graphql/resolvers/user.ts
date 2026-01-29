import prisma from '../../lib/prisma';
import { pubsub } from './_pubsub';

export const User = {
  vehicleUsers: (parent: any) => prisma.vehicleUser.findMany({ where: { userId: parent.id } }),
  createdAt: (parent: any) => formatDate(parent.createdAt),
  updatedAt: (parent: any) => formatDate(parent.updatedAt),
  balance: (parent: any) => parent.balance,
  isOnline: (parent: any) => parent.isOnline,
  maxBalance: (parent: any) => parent.maxBalance,
  phone: (parent: any) => parent.phone,
  data: (parent: any) => parent.data,
};

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const Query = {
  me: async (_: any, __: any, context: any) => {
    const discordId = context.discordId;
    if (!discordId) return null;
    return prisma.user.findUnique({ where: { discordId } });
  },
  user: async (_: any, { discordId }: { discordId: string }) => {
    return prisma.user.findUnique({ where: { discordId } });
  },
  userById: async (_: any, { id }: { id: string }) => {
    return prisma.user.findUnique({ where: { id } });
  },
  users: async () => {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  },
  usersCount: async () => {
    return prisma.user.count();
  },
};

export const Mutation = {
  registerOrUpdateUser: async (_: any, { input }: { input: any }, context: any) => {
    const { discordId, username, name, email, avatar } = input;
    const existing = await prisma.user.findUnique({ where: { discordId } });
    let user;
    if (existing) {
      user = await prisma.user.update({
        where: { discordId },
        data: {
          username,
          name: name ?? existing.name,
          email,
          avatar,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          discordId,
          username,
          name: name ?? username,
          email,
          avatar,
          role: 'GUEST',
        },
      });
    }
    await pubsub.publish('USER_UPDATED', { userUpdated: user });
    return user;
  },
  deleteUser: async (_: any, { discordId }: { discordId: string }, context: any) => {
    const before = await prisma.user.findUnique({ where: { discordId } });
    const deleted = await prisma.user.delete({ where: { discordId } });
    await prisma.log.create({
      data: {
        action: 'DELETE',
        entity: 'User',
        entityId: deleted.id,
        userId: context.user?.id || deleted.id,
        diff: JSON.stringify({ before }),
      },
    });
    return true;
  },
  updateUser: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
    const before = await prisma.user.findUnique({ where: { id } });
    if (!before) throw new Error('Utilisateur introuvable');
    const updateData: any = {};
    const allowedFields = [
      'username', 'name', 'email', 'avatar', 'isOnline', 'balance', 'maxBalance', 'role', 'phone', 'data',
    ];
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        updateData[key] = input[key];
      }
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'phone') && updateData.phone) {
      if (!updateData.phone.startsWith('555-')) {
        throw new Error('Le numéro doit commencer par 555-');
      }
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'role') && updateData.role) {
      const validRoles = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      if (!validRoles.includes(updateData.role)) {
        throw new Error(`Invalid role: ${updateData.role}`);
      }
    }
    const user = await prisma.user.update({ where: { id }, data: updateData });
    await prisma.log.create({
      data: {
        action: 'UPDATE',
        entity: 'User',
        entityId: user.id,
        userId: context.user?.id || user.id,
        diff: JSON.stringify({ before, after: user }),
      },
    });
    await pubsub.publish('USER_UPDATED', { userUpdated: user });
    return user;
  },
};