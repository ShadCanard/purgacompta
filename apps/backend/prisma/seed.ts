
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


  // Lecture du JSON users
  const usersPath = path.join(__dirname, 'users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { discordId: user.discordId },
      update: {},
      create: {
        ...user,
        data: JSON.stringify(user.data),
      },
    });
    console.log('✅ Created user:', created);
  }

  console.log("✅ Users created !");

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
  console.log('✅ Groups created !');


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
  console.log('✅ Vehicles created !');


  const itemsPath = path.join(__dirname, 'items.json');
  const items = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));

  for (const item of items) {
    const exists = await prisma.item.findFirst({ 
      where: { 
        name: item.name, 
        weight: item.weight, 
        sellable: item.sellable, 
        weapon: item.weapon 
      } 
    });
    if (!exists) {
      await prisma.item.create({ data: item });
      console.log('✅ Created item', item.name);
    }
  }
  console.log('✅ Items created !');
    
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
