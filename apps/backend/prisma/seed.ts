
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Correction pour __dirname en ESM, compatible Windows
let __dirname = path.dirname(new URL(import.meta.url).pathname);
if (process.platform === 'win32' && __dirname.startsWith('/')) {
  __dirname = __dirname.slice(1);
}

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


  await prisma.group.upsert({ where: { name: 'Purgatory' }, update: {}, create: { name: 'Purgatory' } });
  console.log('✅ Created group Purgatory');

  // Lecture du JSON groups
  const groupsPath = path.join(__dirname, 'groups.json');
  const groups = JSON.parse(fs.readFileSync(groupsPath, 'utf-8'));
  for (const group of groups) {
    await prisma.group.upsert({
      where: { name: group.name },
      update: {},
      create: group,
    });
    console.log('✅ Created group', group.name);
  }

  // Lecture du JSON vehicles
  const vehiclesPath = path.join(__dirname, 'vehicles.json');
  const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, 'utf-8'));
  for (const v of vehicles) {
    const exists = await prisma.vehicle.findFirst({ where: { name: v.name } });
    if (!exists) {
      await prisma.vehicle.create({ data: v });
      console.log('✅ Created vehicle', v.name);
    }
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
