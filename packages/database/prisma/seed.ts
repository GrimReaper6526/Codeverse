import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial CodeVerse database records...');

  // 1. Create or update primary developer user
  const user = await prisma.user.upsert({
    where: { email: 'dev@codeverse.ai' },
    update: {},
    create: {
      email: 'dev@codeverse.ai',
      name: 'GrimReaper6526',
      avatar: 'https://github.com/GrimReaper6526.png',
      provider: 'GITHUB',
      role: 'OWNER',
    },
  });

  console.log(`✅ Seeded User: ${user.name} (${user.id})`);

  // 2. Create primary organization workspace
  const org = await prisma.organization.upsert({
    where: { slug: 'codeverse-workspace' },
    update: {},
    create: {
      name: 'CodeVerse Workspace',
      slug: 'codeverse-workspace',
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
  });

  console.log(`✅ Seeded Organization: ${org.name} (${org.id})`);

  // 3. Create primary project
  const project = await prisma.project.create({
    data: {
      name: 'CodeVerse Monorepo',
      description: '3D AI-Powered Software Universe Platform',
      visibility: 'PUBLIC',
      ownerId: user.id,
      organizationId: org.id,
      repositories: {
        create: {
          name: 'Codeverse',
          gitProvider: 'GITHUB',
          gitUrl: 'https://github.com/GrimReaper6526/Codeverse',
          branch: 'main',
          symbolCount: 313,
          status: 'synced',
        },
      },
    },
  });

  console.log(`✅ Seeded Project: ${project.name} (${project.id})`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
