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
        firstName: 'Jackson',
        lastName: 'Johnson',
        alias: 'Jax',
        phone: '555-6181',
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
        firstName: 'Miky',
        lastName: 'Quest',
        phone: '555-2438',
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

  const peyote = await prisma.vehicle.findFirst({
    where: { name: 'Peyote' },
  });

  if(!peyote)
  {
    await prisma.vehicle.create({
    data: {
      name: 'Peyote',
      front: 'https://static.wikia.nocookie.net/gtawiki/images/4/4b/Peyote-GTAV-FrontQuarter.png/revision/latest/scale-to-width-down/1000?cb=20160323190724',
      back: 'https://static.wikia.nocookie.net/gtawiki/images/d/d3/Peyote-GTAV-RearQuarter.png/revision/latest/scale-to-width-down/1000?cb=20160323190818',
    },
  });
  console.log('✅ Created vehicle Peyote');
  }

  const tornado = await prisma.vehicle.findFirst({
    where: { name: 'Tornado' },
  });

  if(!tornado)
  {
    await prisma.vehicle.create({
    data: {
      name: 'Tornado',
      front: 'https://static.wikia.nocookie.net/gtawiki/images/e/ee/Tornado-GTAV-FrontQuarter.png/revision/latest/scale-to-width-down/1000?cb=20180512140313',
      back: 'https://static.wikia.nocookie.net/gtawiki/images/d/d3/Tornado-GTAV-RearQuarter.png/revision/latest/scale-to-width-down/1000?cb=20180512140314',
    },
  });
  console.log('✅ Created vehicle Tornado');
  }

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
