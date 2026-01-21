import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer un utilisateur admin par défaut (à remplacer par votre Discord ID)
  const adminUser = await prisma.user.upsert({
    where: { discordId: 'VOTRE_DISCORD_ID' },
    update: {},
    create: {
      discordId: 'VOTRE_DISCORD_ID',
      username: 'Admin',
      email: 'admin@purgatory.com',
      role: 'OWNER',
    },
  });

  console.log('✅ Created admin user:', adminUser);
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
