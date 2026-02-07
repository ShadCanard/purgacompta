import prisma from '../../lib/prisma.js';
import { UserData } from '@purgacompta/common/types/user';

export const Contact = {
  group: async (parent: any) => {
    if (!parent.groupid) return null;
    return prisma.group.findUnique({ where: { id: parent.groupid } });
  },
};

export const Query = {
  contacts: async () => {
    const filterMembers = await prisma.user.findMany({ select: { data: true } });
    const memberPhones = new Set(
      filterMembers
        .map(m => m.data ? (JSON.parse(m.data) as UserData).phone : undefined)
        .filter((p): p is string => !!p)
    );
    return prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, include: { group: true } }).then(contacts =>
      contacts.filter(contact => !memberPhones.has(contact.phone))
    );
  },
  contactById: async (_: any, { id }: { id: string }) => {
    return prisma.contact.findUnique({ where: { id } });
  },
  contactsWithoutGroup: async () => {
    const users = await prisma.user.findMany({ select: { data: true } });
    const userPhones = new Set(
      users
        .map(u => u.data ? (JSON.parse(u.data) as UserData).phone : undefined)
        .filter((p): p is string => !!p)
    );
    const contacts = await prisma.contact.findMany({ where: { groupid: null }, orderBy: { createdAt: 'desc' } });
    return contacts.filter(contact => !userPhones.has(contact.phone));
  },
};

export const Mutation = {
  createContact: async (_: any, { input }: { input: { name: string; phone: string; groupId?: string } }) => {
    if (!input.phone.startsWith('555-')) {
      throw new Error('Le numéro doit commencer par 555-');
    }
    const existing = await prisma.contact.findFirst({ where: { phone: input.phone }, include: { group: true } });
    if (existing) {
      const groupInfo = existing.group ? `(Groupe: ${existing.group.name})` : '';
      throw new Error(`Il existe déjà un contact avec le numéro ${input.phone} : ${existing.name} ${groupInfo}`);
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
  updateContact: async (_: any, { input }: { input: { id: string; name?: string; phone?: string; groupId?: string } }) => {
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
  deleteContact: async (_: any, { id }: { id: string }) => {
    await prisma.contact.delete({ where: { id } });
    return true;
  },
  importContacts: async (_: any, { input }: { input: Array<{ display: string; number: string }> }) => {
    const existing = await prisma.contact.findMany({ select: { phone: true } });
    const existingNumbers = new Set(existing.map(c => c.phone));
    const toCreate = input.filter(c => !existingNumbers.has(c.number));
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
};
