import prisma from '../../lib/prisma';

export const Log = {
  createdAt: (parent: any) => formatDate(parent.createdAt),
  user: (parent: any) => prisma.user.findUnique({ where: { id: parent.userId } }),
};

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const Query = {
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
};
