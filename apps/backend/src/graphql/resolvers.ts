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
  },

  Mutation: {
    // Enregistrer ou mettre à jour un utilisateur lors de la connexion
    registerOrUpdateUser: async (_: any, { input }: { input: RegisterUserInput }) => {
      const { discordId, username, name, email, avatar } = input;

      // Upsert: créer si n'existe pas, sinon mettre à jour
      const user = await prisma.user.upsert({
        where: { discordId },
        update: {
          username,
          name: name ?? username,
          email,
          avatar,
        },
        create: {
          discordId,
          username,
          name: name ?? username,
          email,
          avatar,
          role: 'GUEST', // Rôle par défaut pour les nouveaux utilisateurs
        },
      });

      return user;
    },
    // Mettre à jour le nom affiché d'un utilisateur
    updateUserName: async (_: any, { input }: { input: UpdateUserNameInput }) => {
      const { discordId, name } = input;
      const user = await prisma.user.update({
        where: { discordId },
        data: { name },
      });
      return user;
    },

    // Mettre à jour le rôle d'un utilisateur
    updateUserRole: async (_: any, { input }: { input: UpdateUserRoleInput }) => {
      const { discordId, role } = input;

      // Vérifier que le rôle est valide
      const validRoles = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }

      const user = await prisma.user.update({
        where: { discordId },
        data: { role },
      });

      return user;
    },

    // Supprimer un utilisateur
    deleteUser: async (_: any, { discordId }: { discordId: string }) => {
      await prisma.user.delete({
        where: { discordId },
      });
      return true;
    },
  },
};
