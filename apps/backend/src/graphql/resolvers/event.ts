import prisma from '../../lib/prisma.js';
import { pubsub } from './_pubsub.js';


export const Query = {
  events: async () => {
    return await prisma.event.findMany({ include: { bets: true } });
  },
  event: async (_: any, { id }: { id: string }) => {
    return await prisma.event.findUnique({ where: { id }, include: { bets: true } });
  },
  bets: async () => {
    return await prisma.bet.findMany();
  },
  bet: async (_: any, { id }: { id: string }) => {
    return await prisma.bet.findUnique({ where: { id } });
  },
  contestantsByEvent: async (_: any, { eventId }: { eventId: string }) => {
    // Récupère tous les EventContestant pour l'event
    const eventContestants = await prisma.eventContestant.findMany({ where: { eventId } });
    const contestantIds = eventContestants.map(ec => ec.contestantId);
    // Récupère tous les contacts et groupes
    const [contacts, groups] = await Promise.all([
      prisma.contact.findMany({ where: { id: { in: contestantIds } }, select: { id: true, name: true } }),
      prisma.group.findMany({ where: { id: { in: contestantIds } }, select: { id: true, name: true, color1: true } }),
    ]);
    // Fusionne et ajoute la note du participant (depuis EventContestant)
    const all = [...contacts, ...groups];
    return all.map(participant => {
      const ec = eventContestants.find(ec => ec.contestantId === participant.id);
      let color = null;
      if ('color1' in participant) {
        color = participant.color1 || null;
      } else {
        color = '#f35050';
      }
      return {
        ...participant,
        notes: ec?.notes || null,
        color,
      };
    });
  },
  betsByEvent: async (_: any, { eventId }: { eventId: string }) => {
	return await prisma.bet.findMany({ where: { eventId } });
  }
};

export const Event = {
  notes: (parent: any) => parent.notes,
  participants: async (parent: any) => {
    // Récupère tous les EventContestant pour l'event
    const eventContestants = await prisma.eventContestant.findMany({ where: { eventId: parent.id } });
    const contestantIds = eventContestants.map(ec => ec.contestantId);
    // Récupère tous les contacts et groupes
    const [contacts, groups] = await Promise.all([
      prisma.contact.findMany({ where: { id: { in: contestantIds } }, select: { id: true, name: true } }),
      prisma.group.findMany({ where: { id: { in: contestantIds } }, select: { id: true, name: true, color1: true } }),
    ]);
    // Fusionne et ajoute la note du participant (depuis EventContestant)
    const all = [...contacts, ...groups];
    return all.map(participant => {
      const ec = eventContestants.find(ec => ec.contestantId === participant.id);
      let color = null;
      if ('color1' in participant) {
        color = participant.color1 || null;
      } else {
        color = '#f35050';
      }
      return {
        ...participant,
        notes: ec?.notes || null,
        color,
      };
    });
  },
};

export const Mutation = {
  createEvent: async (_: any, { name, startDate }: { name: string; startDate: string }) => {
    return await prisma.event.create({ data: { name, startDate: new Date(startDate) } });
  },
  updateEvent: async (_: any, { id, name, startDate, notes }: { id: string; name?: string; startDate?: string; notes?: string }) => {
    const value = await prisma.event.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(notes !== undefined && { notes }),
      },
    });
	// Publish eventUpdated pour les abonnés
	pubsub.publish('EVENT_UPDATED', { eventUpdated: value });
	return value;
  },
  deleteEvent: async (_: any, { id }: { id: string }) => {
    const toDelete = await prisma.event.delete({ where: { id } });
	pubsub.publish('EVENT_UPDATED', { eventUpdated: toDelete }); // Notifie les abonnés de la suppression
	//Suppression des paris associés à l'événement et des participants
	await prisma.bet.deleteMany({ where: { eventId: id } });
	await prisma.eventContestant.deleteMany({ where: { eventId: id } });
	return toDelete;
  },
  createBet: async (_: any, { eventId, contestantId, gamblerId, amount }: { eventId: string; contestantId: string; gamblerId: string; amount: number }) => {

    const value = await prisma.bet.create({ data: { eventId, contestantId, gamblerId, amount } });
	pubsub.publish('BET_UPDATED', { betUpdated: value }); // Notifie les abonnés de la création
	return value;
  },
  updateBet: async (_: any, { id, amount }: { id: string; amount?: number }) => {
    const value = await prisma.bet.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount }),
      },
    });
	pubsub.publish('BET_UPDATED', { betUpdated: value }); // Notifie les abonnés de la mise à jour
	return value;
  },
  deleteBet: async (_: any, { id }: { id: string }) => {
    const value = await prisma.bet.delete({ where: { id } });
	pubsub.publish('BET_UPDATED', { betUpdated: value }); // Notifie les abonnés de la suppression
	return value;
  },
  createContestant: async (_: any, { contestantId, eventId }: { contestantId: string, eventId: string }) => {
    // Crée le lien EventContestant
    const contestantLink = await prisma.eventContestant.create({ data: { contestantId, eventId } });
    // Cherche le participant (Contact ou Group)
    let participant = await prisma.contact.findUnique({ where: { id: contestantId }, select: { id: true, name: true } });
    let color = null;
    if (participant) {
      color = '#f35050';
    } else {
      const group = await prisma.group.findUnique({ where: { id: contestantId }, select: { id: true, name: true, color1: true } });
      if (group) {
        participant = group;
        color = group.color1 || null;
      }
    }
    const result = {
      ...participant,
      notes: contestantLink.notes || null,
      color,
    };
    const value = await prisma.event.findFirst({ where: { id: eventId }, include: { eventContestants: true } });
    pubsub.publish('EVENT_UPDATED', { eventUpdated: value });
    return result;
  },

  updateContestant: async (_: any, { eventId, contestantId, notes }: { eventId: string, contestantId: string, notes?: string }) => {
    // Met à jour la note du participant pour cet event
    const updated = await prisma.eventContestant.update({
      where: { eventId, contestantId },
      data: { notes },
    });
    // Cherche d'abord dans Contact
    let participant = await prisma.contact.findUnique({ where: { id: contestantId }, select: { id: true, name: true } });
    let color = null;
    if (participant) {
      color = '#f35050';
    } else {
      // Sinon cherche dans Group et récupère color1
      const group = await prisma.group.findUnique({ where: { id: contestantId }, select: { id: true, name: true, color1: true } });
      if (group) {
        participant = group;
        color = group.color1 || null;
      }
    }
    const result = {
      ...participant,
      notes: updated.notes,
      color,
    };
    pubsub.publish('CONTESTANT_UPDATED', { contestantUpdated: result });
    return result;
  },
};

export const Bet = {
  contestant: async (parent: any) => {    
    const [contact, group] = await Promise.all([
      prisma.contact.findFirst({ where: { id: { in: parent.contestantId } }, select: { id: true, name: true } }),
      prisma.group.findFirst({ where: { id: { in: parent.contestantId } }, select: { id: true, name: true, color1: true } }),
    ]);
    if (contact) {
      return { ...contact, color: '#f35050' };
    } else if (group) {
      return { ...group, color: group.color1 || null };
    }
    return null;
  },
  gambler: async (parent: any) => {
        const [contact, group] = await Promise.all([
      prisma.contact.findFirst({ where: { id: { in: parent.gamblerId } }, select: { id: true, name: true } }),
      prisma.group.findFirst({ where: { id: { in: parent.gamblerId } }, select: { id: true, name: true } }),
    ]);
    return contact || group || null;
  },
};






























