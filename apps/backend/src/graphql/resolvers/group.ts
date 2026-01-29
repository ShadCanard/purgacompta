import prisma from '../../lib/prisma';

export const Group = {
  createdAt: (parent: any) => formatDate(parent.createdAt),
  updatedAt: (parent: any) => formatDate(parent.updatedAt),
};

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const Query = {
  groupById: async (_: any, { id }: { id: string }) => {
    return prisma.group.findUnique({ where: { id } });
  },
  groups: async () => {
    return prisma.group.findMany({
      orderBy: { createdAt: 'desc' },
      where: { NOT: { name: 'Purgatory' } },
    });
  },
  groupsCount: async () => {
    return prisma.group.count({ where: { NOT: { name: 'Purgatory' } } });
  },
  myGroup: async () => {
    return prisma.group.findUnique({ where: { name: 'Purgatory' } });
  },
};

export const Mutation = {
  createGroup: async (_: any, { name, tag, description, color1, color2, isActive }: { name: string; tag?: string; description?: string; color1?: string; color2?: string; isActive?: boolean }) => {
    const exists = await prisma.group.findUnique({ where: { name } });
    if (exists) throw new Error('Un groupe avec ce nom existe déjà');
    return prisma.group.create({
      data: {
        name,
        tag: tag || null,
        description: description || null,
        color1: color1 || null,
        color2: color2 || null,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });
  },
  updateGroup: async (_: any, { input }: { input: { id: string; name?: string; tag?: string; description?: string; color1?: string; color2?: string; isActive?: boolean } }) => {
    const { id, ...data } = input;
    return prisma.group.update({
      where: { id },
      data: {
        ...data,
        color1: data.color1 ?? undefined,
        color2: data.color2 ?? undefined,
      },
    });
  },
  deleteGroup: async (_: any, { id }: { id: string }) => {
    await prisma.group.delete({ where: { id } });
    return true;
  },
};
