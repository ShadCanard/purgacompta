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

  transactionDetailsList: async () => {
    // Récupérer tous les groupes et contacts
    const [groups, contacts] = await Promise.all([
      prisma.group.findMany({ orderBy: { name: 'asc' } }),
      prisma.contact.findMany({ orderBy: { name: 'asc' } }),
    ]);

    // Récupérer toutes les transactions et vehicleTransactions
    const [transactions, vehicleTransactions] = await Promise.all([
      prisma.transaction.findMany({}),
      prisma.vehicleTransaction.findMany({}),
    ]);

    // Indexer les transactions par targetId
    const allEntities = [
      ...groups.map(g => ({ id: g.id, name: g.name, type: 'group' })),
      ...contacts.map(c => ({ id: c.id, name: c.name, type: 'contact' })),
    ];

    return allEntities.map(entity => {
      // Transactions classiques
      const entityTransactions = transactions.filter(t => t.targetId === entity.id);
      // VehicleTransactions
      const entityVehicleTransactions = vehicleTransactions.filter(vt => vt.targetId === entity.id);

      // Montant total
      const totalAmount = [
        ...entityTransactions.map(t => t.totalFinal || 0),
        ...entityVehicleTransactions.map(vt => vt.rewardAmount || 0),
      ].reduce((acc, val) => acc + val, 0);

      // Dernière date
      const lastDates = [
        ...entityTransactions.map(t => t.createdAt),
        ...entityVehicleTransactions.map(vt => vt.createdAt),
      ].filter(Boolean);
      const lastTransactionAt = lastDates.length
        ? new Date(Math.max(...lastDates.map(d => new Date(d).getTime()))).toISOString()
        : null;

      return {
        id: entity.id,
        name: entity.name,
        totalAmount,
        lastTransactionAt,
      };
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
