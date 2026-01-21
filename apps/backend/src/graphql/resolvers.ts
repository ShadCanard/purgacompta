import prisma from '../lib/prisma';

// Types pour les inputs

interface RegisterUserInput {
  discordId: string;
  username: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface UpdateUserNameInput {
  discordId: string;
  name: string;
}

interface UpdateUserRoleInput {
  discordId: string;
  role: string;
}

export const resolvers = {
  Query: {
    // Récupérer l'utilisateur authentifié
    me: async (_: any, __: any, context: any) => {
      // On attend que le contexte contienne le discordId de l'utilisateur
      const discordId = context.discordId;
      if (!discordId) return null;
      return prisma.user.findUnique({ where: { discordId } });
    },
    // Récupérer un utilisateur par Discord ID
    user: async (_: any, { discordId }: { discordId: string }) => {
      return prisma.user.findUnique({
        where: { discordId },
      });
    },

    // Récupérer un utilisateur par ID
    userById: async (_: any, { id }: { id: string }) => {
      return prisma.user.findUnique({
        where: { id },
      });
    },

    // Récupérer tous les utilisateurs
    users: async () => {
      return prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },

    // Compter les utilisateurs
    usersCount: async () => {
      return prisma.user.count();
    },

    // Récupérer les logs avec filtres/recherche
    logs: async (_: any, { filter, skip = 0, take = 50 }: any) => {
      const where: any = {};
      if (filter) {
        if (filter.action) where.action = filter.action;
        if (filter.entity) where.entity = filter.entity;
        if (filter.userId) where.userId = filter.userId;
        if (filter.from || filter.to) {
          where.createdAt = {};
          if (filter.from) where.createdAt.gte = new Date(filter.from);
          if (filter.to) where.createdAt.lte = new Date(filter.to);
        }
        if (filter.search) {
          // Recherche sur diff ou entityId
          where.OR = [
            { diff: { contains: filter.search } },
            { entityId: { contains: filter.search } },
          ];
        }
      }
      return prisma.log.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { user: true },
      });
    },
  },

  Mutation: {
    // Enregistrer ou mettre à jour un utilisateur lors de la connexion
    registerOrUpdateUser: async (_: any, { input }: { input: RegisterUserInput }, context: any) => {
      const { discordId, username, name, email, avatar } = input;
      const existing = await prisma.user.findUnique({ where: { discordId } });
      let user;
      let action;
      let diff = null;
      if (existing) {
        // Mise à jour
        user = await prisma.user.update({
          where: { discordId },
          data: {
            username,
            name: name ?? username,
            email,
            avatar,
          },
        });
        action = 'UPDATE';
        diff = JSON.stringify({ before: existing, after: user });
      } else {
        // Création
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
        action = 'CREATE';
        diff = JSON.stringify({ after: user });
      }
      // Log
      await prisma.log.create({
        data: {
          action,
          entity: 'User',
          entityId: user.id,
          userId: context.user?.id || user.id,
          diff,
        },
      });
      return user;
    },
    // Mettre à jour le nom affiché d'un utilisateur
    updateUserName: async (_: any, { input }: { input: UpdateUserNameInput }, context: any) => {
      const { discordId, name } = input;
      const before = await prisma.user.findUnique({ where: { discordId } });
      const user = await prisma.user.update({
        where: { discordId },
        data: { name },
      });
      await prisma.log.create({
        data: {
          action: 'UPDATE',
          entity: 'User',
          entityId: user.id,
          userId: context.user?.id || user.id,
          diff: JSON.stringify({ before, after: user }),
        },
      });
      return user;
    },

    // Mettre à jour le rôle d'un utilisateur
    updateUserRole: async (_: any, { input }: { input: UpdateUserRoleInput }, context: any) => {
      const { discordId, role } = input;
      const validRoles = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }
      const before = await prisma.user.findUnique({ where: { discordId } });
      const user = await prisma.user.update({
        where: { discordId },
        data: { role },
      });
      await prisma.log.create({
        data: {
          action: 'UPDATE',
          entity: 'User',
          entityId: user.id,
          userId: context.user?.id || user.id,
          diff: JSON.stringify({ before, after: user }),
        },
      });
      return user;
    },

    // Supprimer un utilisateur
    deleteUser: async (_: any, { discordId }: { discordId: string }, context: any) => {
      const before = await prisma.user.findUnique({ where: { discordId } });
      const deleted = await prisma.user.delete({
        where: { discordId },
      });
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
  },
};
