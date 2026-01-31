import prisma from '../../lib/prisma';
import { subDays, startOfDay } from 'date-fns';

export const Query = {
  userAccountHistoryStats: async () => {

    const purgatoryId = (await prisma.group.findUnique({ where: { name: 'Purgatory' } }))?.id;
    if (!purgatoryId) {
      throw new Error('Groupe Purgatory non trouvé');
    }

    const now = new Date();
    const startOfToday = startOfDay(now);
    const startOfWeek = subDays(startOfToday, 6);
    const startOfLastWeek = subDays(startOfWeek, 7);
    const endOfLastWeek = subDays(startOfWeek, 1);

    const weekHistories = await prisma.userAccountHistory.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: now,
        },
      },
    });
    const lastWeekHistories = await prisma.userAccountHistory.findMany({
      where: {
        createdAt: {
          gte: startOfLastWeek,
          lte: endOfLastWeek,
        },
      },
    });

    const weekTransactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
            gte: startOfWeek,
            lte: now,
        },
        },
    });
    const lastWeekTransactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
            gte: startOfLastWeek,
            lte: endOfLastWeek,
        },
        },
    });

    const transactionsCount = weekTransactions.length;
    const transactionsCountLastWeek = lastWeekTransactions.length;
    
    const totalAmount = weekTransactions.reduce((sum, h) => sum + (h.totalFinal || 0), 0);
    const totalAmountLastWeek = lastWeekTransactions.reduce((sum, h) => sum + (h.totalFinal || 0), 0);

    // Découpage entrantes/sortantes (entrante: amount > 0, sortante: amount < 0)
    const totalIncoming = weekTransactions.filter(t => t.sourceId === purgatoryId).reduce((sum, t) => sum + (t.totalFinal || 0), 0);
    const totalOutgoing = weekTransactions.filter(t => t.targetId === purgatoryId).reduce((sum, t) => sum + (t.totalFinal || 0), 0);

    // Découpage entrantes/sortantes (entrante: amount > 0, sortante: amount < 0)
    const totalIncomingLastWeek = lastWeekTransactions.filter(t => t.sourceId === purgatoryId).reduce((sum, t) => sum + (t.totalFinal || 0), 0);
    const totalOutgoingLastWeek = lastWeekTransactions.filter(t => t.targetId === purgatoryId).reduce((sum, t) => sum + (t.totalFinal || 0), 0);

    const totalBalance = weekHistories.length > 0 ? weekHistories[weekHistories.length - 1].amount : 0;
    const totalBalanceLastWeek = lastWeekHistories.length > 0 ? lastWeekHistories[lastWeekHistories.length - 1].amount : 0;

    // VehicleTransactions (comptage)
    const vehicleTransactionsCount = await prisma.vehicleTransaction.count({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: now,
        },
      },
    });
    const vehicleTransactionsCountLastWeek = await prisma.vehicleTransaction.count({
      where: {
        createdAt: {
          gte: startOfLastWeek,
          lte: endOfLastWeek,
        },
      },
    });

    return {
      transactionsCount,
      transactionsCountLastWeek,
      totalBalance,
      totalBalanceLastWeek,
      totalAmount,
      totalAmountLastWeek,
      totalIncoming,
      totalIncomingLastWeek,
      totalOutgoing,
      totalOutgoingLastWeek,
      vehicleTransactionsCount,
      vehicleTransactionsCountLastWeek,
    };
  },
};
