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

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const resolvers = {
  Group: {
    createdAt: (parent: any) => formatDate(parent.createdAt),
    updatedAt: (parent: any) => formatDate(parent.updatedAt),
  },
  ItemPrice: {
    item: (parent: any) => prisma.item.findUnique({ where: { id: parent.itemId } }),
    group: (parent: any) => prisma.group.findUnique({ where: { id: parent.groupId } }),
    createdAt: (parent: any) => formatDate(parent.createdAt),
    updatedAt: (parent: any) => formatDate(parent.updatedAt),
  },
  User: {
    createdAt: (parent: any) => formatDate(parent.createdAt),
    updatedAt: (parent: any) => formatDate(parent.updatedAt),
    balance: (parent: any) => parent.balance,
    isOnline: (parent: any) => parent.isOnline,
    maxBalance: (parent: any) => parent.maxBalance,
  },
  Log: {
    createdAt: (parent: any) => formatDate(parent.createdAt),
  },
  Contact: {
    group: async (parent: any) => {
      if (!parent.groupid) return null;
      return prisma.group.findUnique({ where: { id: parent.groupid } });
    },
  },

    Item: {
    createdAt: (parent: any) => formatDate(parent.createdAt),
    updatedAt: (parent: any) => formatDate(parent.updatedAt),
  },
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
    
    // Récupérer un utilisateur par ID
    groupById: async (_: any, { id }: { id: string }) => {
      return prisma.group.findUnique({
        where: { id },
      });
    },

    // Récupérer tous les utilisateurs
    groups: async () => {
      return prisma.group.findMany({
        orderBy: { createdAt: 'desc' },
        where: {
          NOT: {
            name: 'Purgatory',
          }
        }
      });
    },

    // Compter les utilisateurs
    groupsCount: async () => {
      return prisma.group.count({
        where: {
          NOT: {
            name: 'Purgatory',
          }
        }
      });
    },

    myGroup: async () => {
      return prisma.group.findUnique({
        where: { name: 'Purgatory' },
      });
    },

    // Objets CRUD
    items: async () => {
      return prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
    },
    itemById: async (_: any, { id }: { id: string }) => {
      return prisma.item.findUnique({ where: { id } });
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

    // ...existing code...
    // ItemPrice CRUD
    itemPrices: async () => {
      return prisma.itemPrice.findMany({ orderBy: { createdAt: 'desc' } });
    },
    itemPriceById: async (_: any, { id }: { id: string }) => {
      return prisma.itemPrice.findUnique({ where: { id } });
    },
    itemPricesByItem: async (_: any, { itemId }: { itemId: string }) => {
      return prisma.itemPrice.findMany({ where: { itemId }, orderBy: { createdAt: 'desc' } });
    },
    itemPricesByGroup: async (_: any, { groupId }: { groupId: string }) => {
      return prisma.itemPrice.findMany({ where: { groupId }, orderBy: { createdAt: 'desc' } });
    },
    // Contacts CRUD
    contacts: async () => {
      return prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    },
    contactById: async (_: any, { id }: { id: string }) => {
      return prisma.contact.findUnique({ where: { id } });
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


    // Mettre à jour le statut en ligne d'un utilisateur
    updateUserOnline: async (_: any, { discordId, isOnline }: { discordId: string; isOnline: boolean }, context: any) => {
      const before = await prisma.user.findUnique({ where: { discordId } });
      const user = await prisma.user.update({
        where: { discordId },
        data: { isOnline },
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

    // Créer un groupe criminel
    createGroup: async (_: any, { name, tag, description, color1, color2 }: { name: string; tag?: string; description?: string; color1?: string; color2?: string }) => {
      // Vérifie unicité du nom
      const exists = await prisma.group.findUnique({ where: { name } });
      if (exists) throw new Error('Un groupe avec ce nom existe déjà');
      return prisma.group.create({
        data: {
          name,
          tag: tag || null,
          description: description || null,
          color1: color1 || null,
          color2: color2 || null,
        },
      });
    },

    // Modifier un groupe (tous champs)
    updateGroup: async (_: any, { input }: { input: { id: string; name?: string; tag?: string; description?: string; color1?: string; color2?: string; isActive?: boolean } }) => {
      const { id, ...data } = input;
      console.dir(input);
      return prisma.group.update({
        where: { id },
        data: {
          ...data,
          color1: data.color1 ?? undefined,
          color2: data.color2 ?? undefined,
        },
      });
    },

    // Supprimer un groupe criminel
    deleteGroup: async (_: any, { id }: { id: string }, context: any) => {
      await prisma.group.delete({ where: { id } });
      return true;
    },
    // Contacts CRUD
    createContact: async (_: any, { input }: { input: { name: string; phone: string; groupId?: string } }, context: any) => {
      if (!input.phone.startsWith('555-')) {
        throw new Error('Le numéro doit commencer par 555-');
      }
      const contact = await prisma.contact.create({
        data: {
          name: input.name,
          phone: input.phone,
          groupid: input.groupId || null,
        },
      });
      return contact;
    },
    updateContact: async (_: any, { input }: { input: { id: string; name?: string; phone?: string; groupId?: string } }, context: any) => {
      if (input.phone && !input.phone.startsWith('555-')) {
        throw new Error('Le numéro doit commencer par 555-');
      }
      let groupid: string | null | undefined = undefined;
      if (input.hasOwnProperty('groupId')) {
        groupid = input.groupId === '' ? null : input.groupId;
        if (groupid) {
          const groupExists = await prisma.group.findUnique({ where: { id: groupid } });
          if (!groupExists) throw new Error('Groupe inexistant');
        }
      }
      const contact = await prisma.contact.update({
        where: { id: input.id },
        data: {
          name: input.name ?? undefined,
          phone: input.phone ?? undefined,
          groupid,
        },
      });
      return contact;
    },
    deleteContact: async (_: any, { id }: { id: string }, context: any) => {
      await prisma.contact.delete({ where: { id } });
      return true;
    },
    // Objets CRUD
    createItem: async (_: any, { input }: { input: { name: string; weight: number } }, context: any) => {
      return prisma.item.create({
        data: {
          name: input.name,
          weight: input.weight,
        },
      });
    },
    updateItem: async (_: any, { input }: { input: { id: string; name?: string; weight?: number } }, context: any) => {
      return prisma.item.update({
        where: { id: input.id },
        data: {
          name: input.name ?? undefined,
          weight: input.weight ?? undefined,
        },
      });
    },
    deleteItem: async (_: any, { id }: { id: string }, context: any) => {
      await prisma.item.delete({ where: { id } });
      return true;
    },

    // ItemPrice CRUD
    createItemPrice: async (_: any, { input }: { input: { itemId: string; groupId: string; price: number } }, context: any) => {
      // Vérifie unicité (un seul prix par item/groupe)
      const exists = await prisma.itemPrice.findUnique({ where: { itemId_groupId: { itemId: input.itemId, groupId: input.groupId } } });
      if (exists) throw new Error('Un prix existe déjà pour ce couple item/groupe');
      return prisma.itemPrice.create({ data: { itemId: input.itemId, groupId: input.groupId, price: input.price } });
    },
    updateItemPrice: async (_: any, { input }: { input: { id: string; price?: number } }, context: any) => {
      return prisma.itemPrice.update({ where: { id: input.id }, data: { price: input.price ?? undefined } });
    },
    deleteItemPrice: async (_: any, { id }: { id: string }, context: any) => {
      await prisma.itemPrice.delete({ where: { id } });
      return true;
    },
    importContacts: async (_: any, { input }: { input: Array<{ display: string; number: string }> }, context: any) => {
      // Récupère tous les numéros déjà existants
      const existing = await prisma.contact.findMany({ select: { phone: true } });
      const existingNumbers = new Set(existing.map(c => c.phone));
      // Filtre les contacts à importer (uniquement ceux dont le numéro n'existe pas déjà)
      const toCreate = input.filter(c => !existingNumbers.has(c.number));
      // Crée les nouveaux contacts
      const created = await Promise.all(
        toCreate.map(c =>
          prisma.contact.create({
            data: {
              name: c.display,
              phone: c.number,
            },
          })
        )
      );
      return created;
    },

  },
};
