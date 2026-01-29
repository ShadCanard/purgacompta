import prisma from '../../lib/prisma';

export const Item = {
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

export const ItemPrice = {
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
};

export const Query = {
  items: async () => prisma.item.findMany({ orderBy: { createdAt: 'desc' } }),
  itemById: async (_: any, { id }: { id: string }) => prisma.item.findUnique({ where: { id } }),
  sellableItems: async () => prisma.item.findMany({ where: { sellable: true }, orderBy: { createdAt: 'desc' } }),
  weaponItems: async () => prisma.item.findMany({ where: { weapon: true }, orderBy: { createdAt: 'desc' } }),
  itemPrices: async () => prisma.itemPrice.findMany({ orderBy: { createdAt: 'desc' } }),
  itemPriceById: async (_: any, { id }: { id: string }) => prisma.itemPrice.findUnique({ where: { id } }),
  itemPricesByItem: async (_: any, { itemId }: { itemId: string }) => prisma.itemPrice.findMany({ where: { itemId }, orderBy: { createdAt: 'desc' } }),
  itemPricesByGroup: async (_: any, { groupId }: { groupId: string }) => prisma.itemPrice.findMany({ where: { groupId }, orderBy: { createdAt: 'desc' } }),
  itemPricesByTarget: async (_: any, { targetId }: { targetId?: string }) => {
    const allPrices = await prisma.itemPrice.findMany({
      where: { group: { name: 'Purgatory' } },
      orderBy: { createdAt: 'desc' },
    });
    if (!targetId) {
      return allPrices.filter(p => !p.targetId);
    }
    const result: any[] = [];
    const seenItemIds = new Set();
    for (const price of allPrices) {
      if (price.targetId === targetId) {
        result.push(price);
        seenItemIds.add(price.itemId);
      }
    }
    for (const price of allPrices) {
      if (!price.targetId && !seenItemIds.has(price.itemId)) {
        result.push(price);
        seenItemIds.add(price.itemId);
      }
    }
    return result;
  },
  onSellitemPricesByGroup: async (_: any, { groupId }: { groupId: string }) => prisma.itemPrice.findMany({ where: { groupId, onSell: true }, orderBy: { createdAt: 'desc' } }),
};

export const Mutation = {
  createItem: async (_: any, { input }: { input: { name: string; weight: number; sellable?: boolean; weapon?: boolean } }) => {
    return prisma.item.create({
      data: {
        name: input.name,
        weight: input.weight,
        sellable: input.sellable || false,
        weapon: input.weapon || false,
      },
    });
  },
  updateItem: async (_: any, { input }: { input: { id: string; name?: string; weight?: number; sellable?: boolean; weapon?: boolean } }) => {
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
  deleteItem: async (_: any, { id }: { id: string }) => {
    await prisma.item.delete({ where: { id } });
    return true;
  },
  createItemPrice: async (_: any, { input }: { input: { itemId: string; groupId: string; targetId?: string; price: number; onSell?: boolean; buying?: boolean } }) => {
    const exists = await prisma.itemPrice.findUnique({ where: { itemId_groupId_targetId: { itemId: input.itemId, groupId: input.groupId, targetId: input.targetId ?? '' } } });
    if (exists) throw new Error('Un prix existe déjà pour ce couple item/groupe');
    return prisma.itemPrice.create({ data: { itemId: input.itemId, groupId: input.groupId, targetId: input.targetId ?? undefined, price: input.price, onSell: input.onSell ?? true, buying: input.buying ?? true } });
  },
  updateItemPrice: async (_: any, { input }: { input: { id: string; price?: number, onSell?: boolean, buying?: boolean, targetId?: string } }) => {
    return prisma.itemPrice.update({ where: { id: input.id }, data: { 
      price: input.price ?? undefined, 
      onSell: input.onSell ?? undefined, 
      buying: input.buying ?? undefined,
      targetId: input.targetId ?? undefined,
      } 
    });
  },
  deleteItemPrice: async (_: any, { id }: { id: string }) => {
    await prisma.itemPrice.delete({ where: { id } });
    return true;
  },
};
