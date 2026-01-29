import prisma from '../../lib/prisma';

export const Transaction = {
  sourceGroup: (parent: any) => parent.sourceId ? prisma.group.findUnique({ where: { id: parent.sourceId } }) : null,
  targetGroup: (parent: any) => parent.targetId ? prisma.group.findUnique({ where: { id: parent.targetId } }) : null,
  targetContact: (parent: any) => parent.targetId ? prisma.contact.findUnique({ where: { id: parent.targetId } }) : null,
  lines: (parent: any) => prisma.transactionLine.findMany({ where: { transactionId: parent.id } }),
  createdAt: (parent: any) => parent.createdAt instanceof Date ? parent.createdAt.toISOString() : new Date(parent.createdAt).toISOString(),
};

export const TransactionLine = {
  item: (parent: any) => prisma.item.findUnique({ where: { id: parent.itemId } }),
};

export const Query = {
  transactions: async () => prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } }),
  transactionById: async (_: any, { id }: { id: string }) => prisma.transaction.findUnique({ where: { id } }),
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
};

export const Mutation = {
  createTransaction: async (_: any, { input }: { input: any }, context: any) => {
    let { sourceId, targetId, blanchimentPercent, amountToBring, blanchimentAmount, totalFinal, lines } = input;
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
    await prisma.transactionLine.deleteMany({ where: { transactionId: id } });
    await prisma.transaction.delete({ where: { id } });
    return true;
  },
};
