import clientPkg from '@prisma/client';

// PrismaClient peut manquer si le client n'a pas été généré dans l'environnement (ex: Vercel ignoring postinstall)
// On reste résilient en utilisant des any/guards pour ne pas casser la compilation.
const PrismaClientCtor: any = (clientPkg as any).PrismaClient ?? (clientPkg as any).PrismaClient ?? (clientPkg as any).default ?? undefined;

type PrismaAny = any;

declare global {
  var prisma: PrismaAny | undefined;
}

const prisma = global.prisma || new (PrismaClientCtor ?? (class { constructor() {} }))({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma as PrismaAny;
