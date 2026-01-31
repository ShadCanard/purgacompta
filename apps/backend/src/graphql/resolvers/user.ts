import prisma from '../../lib/prisma';
import { pubsub } from './_pubsub';
import { UserData } from '@purgacompta/common';

export const User = {
  vehicleUsers: (parent: any) => prisma.vehicleUser.findMany({ where: { userId: parent.id } }),
  createdAt: (parent: any) => formatDate(parent.createdAt),
  updatedAt: (parent: any) => formatDate(parent.updatedAt),
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
    const user = await prisma.user.findUnique({ where: { discordId } });
    if (!user) return null;
    return { ...user, data: user.data ? (JSON.parse(user.data) as UserData) : undefined };
  },
  user: async (_: any, { discordId }: { discordId: string }) => {
    const user = await prisma.user.findUnique({ where: { discordId } });
    if (!user) return null;
    return { ...user, data: user.data ? (JSON.parse(user.data) as UserData) : undefined };
  },
  userById: async (_: any, { id }: { id: string }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return { ...user, data: user.data ? (JSON.parse(user.data) as UserData) : undefined };
  },
  users: async () => {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map(u => ({ ...u, data: u.data ? (JSON.parse(u.data) as UserData) : undefined }));
  },
  usersCount: async () => {
    return prisma.user.count();
  },
};

export const Mutation = {
  registerOrUpdateUser: async (_: any, { input }: { input: any }, context: any) => {
    const { discordId, username, email, avatar, phone, role, data } = input;
    const existing = await prisma.user.findUnique({ where: { discordId } });
    let user;
    if (existing) {
      // Fusionner l'ancien data et le nouveau
      const oldData: UserData = existing.data ? (JSON.parse(existing.data) as UserData) : {};
      const newData: UserData = data ? data : {};
      const mergedData: UserData = { ...oldData, ...newData };
      user = await prisma.user.update({
        where: { discordId },
        data: {
          username,
          email,
          avatar,
          role,
          data: JSON.stringify(mergedData),
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          discordId,
          username,
          email,
          avatar,
          role: role || 'GUEST',
          data: data ? JSON.stringify(data) : undefined,
        },
      });
    }
    console.log('[BACKEND] Publication USER_UPDATED', user.id, user.username);
    await pubsub.publish('USER_UPDATED', { userUpdated: user });
    return { ...user, data: user.data ? (JSON.parse(user.data) as UserData) : undefined };
  },
  deleteUser: async (_: any, { discordId }: { discordId: string }, context: any) => {
    const before = await prisma.user.findUnique({ where: { discordId } });
    const deleted = await prisma.user.delete({ where: { discordId } });
    // Log supprimé : prisma.log n'existe plus
    return true;
  },
  updateUser: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
    const before = await prisma.user.findUnique({ where: { id } });
    if (!before) throw new Error('Utilisateur introuvable');
    const updateData: any = {};
    const allowedFields = ['username', 'email', 'avatar', 'role', 'data'];
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        updateData[key] = input[key];
      }
    }
    // Gestion du champ data (fusionner avec l'existant)
    if (Object.prototype.hasOwnProperty.call(input, 'data')) {
      const oldData: UserData = before.data ? (JSON.parse(before.data) as UserData) : {};
      const newData: UserData = input.data ? input.data : {};
      updateData.data = JSON.stringify({ ...oldData, ...newData });
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

    console.log('[BACKEND] Publication USER_UPDATED', user.id, user.username);
    await pubsub.publish('USER_UPDATED', { userUpdated: { ...user, data: user.data ? (JSON.parse(user.data) as UserData) : undefined } });
    return { ...user, data: user.data ? (JSON.parse(user.data) as UserData) : undefined };
  },
};