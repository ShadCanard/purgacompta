import prisma from '../../lib/prisma.js';
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

    const weekHistoriesRaw = await prisma.userAccountHistory.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: now,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const lastWeekHistoriesRaw = await prisma.userAccountHistory.findMany({
      where: {
        createdAt: {
          gte: startOfLastWeek,
          lte: endOfLastWeek,
        },
      },
      orderBy: { createdAt: 'desc' },
    });


    // Ne garder que l'élément le plus récent par userId
    const filterLatestByUser = (arr: any[]) => {
      const seen = new Set();
      return arr.filter(h => {
        if (seen.has(h.userId)) return false;
        seen.add(h.userId);
        return true;
      });
    };
    const weekHistories = filterLatestByUser(weekHistoriesRaw);
    const lastWeekHistories = filterLatestByUser(lastWeekHistoriesRaw);

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
    
    const totalAmount = weekTransactions.reduce((sum: number, h: any) => sum + (h.totalFinal || 0), 0);
    const totalAmountLastWeek = lastWeekTransactions.reduce((sum: number, h: any) => sum + (h.totalFinal || 0), 0);

    // Découpage entrantes/sortantes (entrante: amount > 0, sortante: amount < 0)
    const totalIncoming = weekTransactions.filter((t: any) => t.sourceId === purgatoryId).reduce((sum: number, t: any) => sum + (t.totalFinal || 0), 0);
    const totalOutgoing = weekTransactions.filter((t: any) => t.targetId === purgatoryId).reduce((sum: number, t: any) => sum + (t.totalFinal || 0), 0);

    // Découpage entrantes/sortantes (entrante: amount > 0, sortante: amount < 0)
    const totalIncomingLastWeek = lastWeekTransactions.filter((t: any) => t.sourceId === purgatoryId).reduce((sum: number, t: any) => sum + (t.totalFinal || 0), 0);
    const totalOutgoingLastWeek = lastWeekTransactions.filter((t: any) => t.targetId === purgatoryId).reduce((sum: number, t: any) => sum + (t.totalFinal || 0), 0);

    const totalBalance = weekHistories.reduce((sum: number, h: any) => sum + (h.amount || 0), 0);
    const totalBalanceLastWeek = lastWeekHistories.reduce((sum: number, h: any) => sum + (h.amount || 0), 0);

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
