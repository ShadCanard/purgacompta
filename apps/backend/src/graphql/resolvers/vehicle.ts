import prisma from '../../lib/prisma.js';
import { pubsub } from './_pubsub.js';

export const Vehicle = {
  vehicleUsers: (parent: any) => prisma.vehicleUser.findMany({ where: { vehicleId: parent.id } }),
};

export const VehicleUser = {
  vehicle: (parent: any) => parent.vehicleId ? prisma.vehicle.findUnique({ where: { id: parent.vehicleId } }) : null,
  user: (parent: any) => prisma.user.findUnique({ where: { id: parent.userId } }),
};

export const Query = {
  vehicles: async () => prisma.vehicle.findMany({ orderBy: { name: 'asc' } }),
  vehicleById: async (_: any, { id }: { id: string }) => prisma.vehicle.findUnique({ where: { id } }),
  vehicleUsers: async () => prisma.vehicleUser.findMany({}),
  vehicleUserById: async (_: any, { id }: { id: string }) => prisma.vehicleUser.findUnique({ where: { id } }),
  vehicleUsersByVehicle: async (_: any, { vehicleId }: { vehicleId: string }) => prisma.vehicleUser.findMany({ where: { vehicleId } }),
  vehicleUsersByUser: async (_: any, { userId }: { userId: string }) => prisma.vehicleUser.findMany({ where: { userId } }),
};

export const Mutation = {
  setVehicleUser: async (_: any, { input }: { input: { vehicleId?: string; userId: string; found?: boolean } }) => {
    const existing = await prisma.vehicleUser.findFirst({ where: { userId: input.userId } });
    let result;
    if (existing) {
      result = await prisma.vehicleUser.update({
        where: { id: existing.id },
        data: { vehicleId: input.vehicleId ?? null, found: input.found ?? false },
      });
    } else {
      result = await prisma.vehicleUser.create({
        data: {
          vehicleId: input.vehicleId ?? null,
          userId: input.userId,
          found: input.found ?? false,
        },
      });
    }
    await pubsub.publish('TABLET_UPDATED', { tabletUpdated: result });
    return result;
  },
  setVehicleUserFound: async (_: any, { input }: { input: { id: string; found: boolean } }) => {
    const updated = await prisma.vehicleUser.update({ where: { id: input.id }, data: { found: input.found } });
    await pubsub.publish('TABLET_UPDATED', { tabletUpdated: updated });
    return updated;
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
};
