import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer un utilisateur admin par défaut (à remplacer par votre Discord ID)
  const adminUser = await prisma.user.upsert({
    where: { discordId: '234330175775571969' },
    update: {},
    create: {
      discordId: '234330175775571969',
      username: 'shadcanard',
      email: 'admin@purgatory.com',
      role: 'OWNER',
      data: JSON.stringify({
        name: 'Jackson Johnson'
      }),
    },
  });
  console.log('✅ Created admin user:', adminUser);

  const adminUser2 = await prisma.user.upsert({
    where: { discordId: '931609861526016060' },
    update: {},
    create: {
      discordId: '931609861526016060',
      username: 'mikekette',
      email: 'admin2@purgatory.com',
      role: 'OWNER',
      data: JSON.stringify({
        name: 'Miky Quest'
      }),
    },
  });
  console.log('✅ Created admin user:', adminUser2);

  await prisma.group.upsert({
    where: { name: 'Purgatory' },
    update: {},
    create: {
      name: 'Purgatory',
    },
  });
  console.log('✅ Created group Purgatory');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
