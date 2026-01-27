
import prisma from '../lib/prisma';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

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
  Vehicle: {
    vehicleUsers: (parent: any) => prisma.vehicleUser.findMany({ where: { vehicleId: parent.id } }),
  },
  VehicleUser: {
    vehicle: (parent: any) => prisma.vehicle.findUnique({ where: { id: parent.vehicleId } }),
    user: (parent: any) => prisma.user.findUnique({ where: { id: parent.userId } }),
  },
  Transaction: {
    sourceGroup: (parent: any) => parent.sourceId ? prisma.group.findUnique({ where: { id: parent.sourceId } }) : null,
    targetGroup: (parent: any) => parent.targetId ? prisma.group.findUnique({ where: { id: parent.targetId } }) : null,
    targetContact: (parent: any) => parent.targetId ? prisma.contact.findUnique({ where: { id: parent.targetId } }) : null,
    lines: (parent: any) => prisma.transactionLine.findMany({ where: { transactionId: parent.id } }),
    createdAt: (parent: any) => parent.createdAt instanceof Date ? parent.createdAt.toISOString() : new Date(parent.createdAt).toISOString(),
  },
  TransactionLine: {
    item: (parent: any) => prisma.item.findUnique({ where: { id: parent.itemId } }),
  },
  Group: {
    createdAt: (parent: any) => formatDate(parent.createdAt),
    updatedAt: (parent: any) => formatDate(parent.updatedAt),
  },
  ItemPrice: {
    item: (parent: any) => prisma.item.findUnique({ where: { id: parent.itemId } }),
    group: (parent: any) => prisma.group.findUnique({ where: { id: parent.groupId } }),
    targetGroup: (parent: any) => {
      if (!parent.targetGroupId) return null;
      return prisma.group.findUnique({ where: { id: parent.targetGroupId } });
    },
    targetContact: (parent: any) => {
      if (!parent.targetId) return null;
      return prisma.contact.findUnique({ where: { id: parent.targetId } });
    },
    createdAt: (parent: any) => formatDate(parent.createdAt),
    updatedAt: (parent: any) => formatDate(parent.updatedAt),
  },
  User: {
    vehicleUsers: (parent: any) => prisma.vehicleUser.findMany({ where: { userId: parent.id } }),
    createdAt: (parent: any) => formatDate(parent.createdAt),
    updatedAt: (parent: any) => formatDate(parent.updatedAt),
    balance: (parent: any) => parent.balance,
    isOnline: (parent: any) => parent.isOnline,
    maxBalance: (parent: any) => parent.maxBalance,
    phone: (parent: any) => parent.phone,
  },
  Log: {
    createdAt: (parent: any) => formatDate(parent.createdAt),
  },
  Contact: {
    group: async (parent: any) => {
      if (!parent.groupId) return null;
      return prisma.group.findUnique({ where: { id: parent.groupId } });
    },
  },

    Item: {
    createdAt: (parent: any) => formatDate(parent.createdAt),
    updatedAt: (parent: any) => formatDate(parent.updatedAt),
  },
  Query: {
    // VehicleUser CRUD
    vehicleUsers: async () => prisma.vehicleUser.findMany({}),
    vehicleUserById: async (_: any, { id }: { id: string }) => prisma.vehicleUser.findUnique({ where: { id } }),
    vehicleUsersByVehicle: async (_: any, { vehicleId }: { vehicleId: string }) => prisma.vehicleUser.findMany({ where: { vehicleId } }),
    vehicleUsersByUser: async (_: any, { userId }: { userId: string }) => prisma.vehicleUser.findMany({ where: { userId } }),
      vehicles: async () => prisma.vehicle.findMany({ orderBy: { name: 'asc' } }),
      vehicleById: async (_: any, { id }: { id: string }) => prisma.vehicle.findUnique({ where: { id } }),
    transactions: async () => prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } }),
    transactionById: async (_: any, { id }: { id: string }) => prisma.transaction.findUnique({ where: { id } }),
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
    sellableItems: async () => {
      return prisma.item.findMany({ where: { sellable: true }, orderBy: { createdAt: 'desc' } });
    },
    weaponItems: async () => {
      return prisma.item.findMany({ where: { weapon: true }, orderBy: { createdAt: 'desc' } });
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
    itemPricesByTarget: async (_: any, { targetId }: { targetId?: string }) => {
      // On récupère tous les prix pour le groupe Purgatory
      const allPrices = await prisma.itemPrice.findMany({
        where: { group: { name: 'Purgatory' } },
        orderBy: { createdAt: 'desc' },
      });
      if (!targetId) {
        // Si pas de targetId, on retourne uniquement les prix génériques
        return allPrices.filter(p => !p.targetId);
      }
      // On veut :
      // - les prix spécifiques à ce targetId (prioritaires)
      // - sinon, le prix générique (targetId null) pour chaque item
      const result: any[] = [];
      const seenItemIds = new Set();
      // Ajoute d'abord les prix spécifiques
      for (const price of allPrices) {
        if (price.targetId === targetId) {
          result.push(price);
          seenItemIds.add(price.itemId);
        }
      }
      // Ajoute les prix génériques pour les items qui n'ont pas déjà un prix spécifique
      for (const price of allPrices) {
        if (!price.targetId && !seenItemIds.has(price.itemId)) {
          result.push(price);
          seenItemIds.add(price.itemId);
        }
      }
      return result;
    },
    onSellitemPricesByGroup: async (_: any, { groupId }: { groupId: string }) => {
      return prisma.itemPrice.findMany({ where: { groupId, onSell: true }, orderBy: { createdAt: 'desc' } });
    },
    
    // Contacts CRUD
    contacts: async () => {
      const filterMembers = await prisma.user.findMany({select: { phone: true } });
      const memberPhones = filterMembers.map(m => m.phone);
      return prisma.contact.findMany({ orderBy: { createdAt: 'desc' } }).then(contacts =>
        contacts.filter(contact => !memberPhones.includes(contact.phone))
      );
    },
    contactById: async (_: any, { id }: { id: string }) => {
      return prisma.contact.findUnique({ where: { id } });
    },
    contactsWithoutGroup: async () => {
      // Exclure les contacts dont le numéro est déjà utilisé par un User
      const users = await prisma.user.findMany({ select: { phone: true } });
      const userPhones = users.map(u => u.phone);
      const contacts = await prisma.contact.findMany({ where: { groupid: null }, orderBy: { createdAt: 'desc' } });
      return contacts.filter(contact => !userPhones.includes(contact.phone));
    },
    // Récupérer toutes les transactions où entityId est sourceId ou targetId
    transactionsByEntity: async (_: any, { entityId }: { entityId: string }) => {
      return prisma.transaction.findMany({
        where: {
          OR: [
            { sourceId: entityId },
            { targetId: entityId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: { lines: true },
      });
    },
  },

  Subscription: {
    vehicleUserChanged: {
      subscribe: () => pubsub.asyncIterator(['VEHICLE_USER_CHANGED'])
    }
  },
  Mutation: {
    // VehicleUser CRUD
    setVehicleUser: async (_: any, { input }: { input: { vehicleId?: string; userId: string; found?: boolean } }) => {
      // Si vehicleId absent, supprimer l'association pour cet utilisateur
      if (!input.vehicleId) {
        const existing = await prisma.vehicleUser.findFirst({ where: { userId: input.userId } });
        if (existing) {
          await prisma.vehicleUser.delete({ where: { id: existing.id } });
          pubsub.publish('VEHICLE_USER_CHANGED', { vehicleUserChanged: existing });
        }
        return null;
      }
      // Si le user a déjà un véhicule, supprimer l'association avant de créer la nouvelle
      const existing = await prisma.vehicleUser.findFirst({ where: { userId: input.userId } });
      if (existing) {
        await prisma.vehicleUser.delete({ where: { id: existing.id } });
      }
      // Créer la nouvelle association
      const created = await prisma.vehicleUser.create({
        data: {
          vehicleId: input.vehicleId,
          userId: input.userId,
          found: input.found ?? false,
        },
      });
      pubsub.publish('VEHICLE_USER_CHANGED', { vehicleUserChanged: created });
      return created;
    },
    setVehicleUserFound: async (_: any, { input }: { input: { id: string; found: boolean } }) => {
      return prisma.vehicleUser.update({ where: { id: input.id }, data: { found: input.found } });
    },
    deleteVehicleUser: async (_: any, { id }: { id: string }) => {
      await prisma.vehicleUser.delete({ where: { id } });
      return true;
    },
    updateVehicle: async (_: any, { input }: { input: { id: string; name?: string; front?: string; back?: string } }) => {
      const { id, ...data } = input;
      return prisma.vehicle.update({ where: { id }, data });
    },
    deleteVehicle: async (_: any, { id }: { id: string }) => {
      await prisma.vehicle.delete({ where: { id } });
      return true;
    },
    createVehicle: async (_: any, { input }: { input: { name: string; front: string; back: string } }) => {
      return prisma.vehicle.create({ data: input });
    },
    createTransaction: async (_: any, { input }: { input: any }, context: any) => {
      let {
        sourceId,
        targetId,
        blanchimentPercent,
        amountToBring,
        blanchimentAmount,
        totalFinal,
        lines
      } = input;

      // Si sourceId est vide, utiliser l'id du groupe 'Purgatory'
      if (!sourceId) {
        const purgatory = await prisma.group.findUnique({ where: { name: 'Purgatory' } });
        if (purgatory) {
          sourceId = purgatory.id;
        }
      }
      
      const transaction = await prisma.transaction.create({
        data: {
          sourceId: sourceId ?? null,
          targetId: targetId ?? null,
          blanchimentPercent,
          amountToBring,
          blanchimentAmount,
          totalFinal,
          lines: {
            create: lines.map((l: any) => ({
              itemId: l.itemId,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
            })),
          },
        },
        include: { lines: true },
      });
      return transaction;
    },
    deleteTransaction: async (_: any, { id }: { id: string }, context: any) => {
      // Supprimer d'abord les lignes liées
      await prisma.transactionLine.deleteMany({ where: { transactionId: id } });
      // Puis la transaction elle-même
      await prisma.transaction.delete({ where: { id } });
      return true;
    },
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
      // Vérifie unicité du numéro
      const existing = await prisma.contact.findFirst({ where: { phone: input.phone }, include: { group: true } });
      if (existing) {
        throw new Error(`Il existe déjà un contact avec le numéro ${input.phone} : ${existing.name} ${existing.group ? `(Groupe: ${existing.group.name})` : ''}`);
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
    createItem: async (_: any, { input }: { input: { name: string; weight: number; sellable?: boolean; weapon?: boolean } }, context: any) => {
      return prisma.item.create({
        data: {
          name: input.name,
          weight: input.weight,
          sellable: input.sellable || false,
          weapon: input.weapon || false,
        },
      });
    },
    updateItem: async (_: any, { input }: { input: { id: string; name?: string; weight?: number; sellable?: boolean; weapon?: boolean } }, context: any) => {
      return prisma.item.update({
        where: { id: input.id },
        data: {
          name: input.name ?? undefined,
          weight: input.weight ?? undefined,
          sellable: input.sellable ?? undefined,
          weapon: input.weapon ?? undefined,
        },
      });
    },
    deleteItem: async (_: any, { id }: { id: string }, context: any) => {
      await prisma.item.delete({ where: { id } });
      return true;
    },

    // ItemPrice CRUD
    createItemPrice: async (_: any, { input }: { input: { itemId: string; groupId: string; targetId?: string; price: number; onSell?: boolean; buying?: boolean } }, context: any) => {
      // Vérifie unicité (un seul prix par item/groupe)
      const exists = await prisma.itemPrice.findUnique({ where: { itemId_groupId: { itemId: input.itemId, groupId: input.groupId } } });
      if (exists) throw new Error('Un prix existe déjà pour ce couple item/groupe');
      return prisma.itemPrice.create({ data: { itemId: input.itemId, groupId: input.groupId, targetId: input.targetId ?? undefined, price: input.price, onSell: input.onSell ?? true, buying: input.buying ?? true } });
    },
    updateItemPrice: async (_: any, { input }: { input: { id: string; price?: number, onSell?: boolean, buying?: boolean, targetId?: string } }, context: any) => {
      return prisma.itemPrice.update({ where: { id: input.id }, data: { 
        price: input.price ?? undefined, 
        onSell: input.onSell ?? undefined, 
        buying: input.buying ?? undefined,
        targetId: input.targetId ?? undefined,
        } });
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

    updateUserPhone: async (_: any, { input }: { input: { discordId: string; phone: string } }) => {
      if (!input.phone.startsWith('555-')) {
        throw new Error('Le numéro doit commencer par 555-');
      }
      return prisma.user.update({
        where: { discordId: input.discordId },
        data: { phone: input.phone },
      });
    },
  },
};
