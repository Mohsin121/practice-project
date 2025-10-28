// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  const groupRoles = [
    { name: 'OWNER' },
    { name: 'EDITOR' },
    { name: 'MEMBER' },
  ];

  await prisma.role.createMany({
    data: groupRoles,
    skipDuplicates: true,
  });

  console.log('✅ Group Roles seeded.');

  // 2️⃣ --- Seed Permissions ---
  const permissions = [
    // Group related
    { name: 'CREATE_GROUP' },
    { name: 'DELETE_GROUP' },
    { name: 'UPDATE_GROUP' },
    { name: 'MANAGE_MEMBERS' },

    // Post related
    { name: 'CREATE_POST' },
    { name: 'EDIT_POST' },
    { name: 'DELETE_POST' },
    { name: 'VIEW_POST' },
  ];

  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

  console.log('✅ Permissions seeded.');

  // 3️⃣ --- Assign permissions to roles ---

  // Fetch roles and permissions
  const [ownerRole, editorRole, memberRole] = await Promise.all([
    prisma.role.findFirst({ where: { name: 'OWNER' } }),
    prisma.role.findFirst({ where: { name: 'EDITOR' } }),
    prisma.role.findFirst({ where: { name: 'MEMBER' } }),
  ]);

  const allPermissions = await prisma.permission.findMany();

  // Assign all permissions to OWNER
  if (ownerRole) {
    await prisma.rolePermission.createMany({
      data: allPermissions.map((perm) => ({
        roleId: ownerRole.id,
        permissionId: perm.id,
      })),
      skipDuplicates: true,
    });
  }

  // Assign limited permissions to EDITOR
  if (editorRole) {
    const editorPerms = allPermissions.filter((p) =>
      ['CREATE_POST', 'EDIT_POST', 'VIEW_POST'].includes(p.name)
    );

    await prisma.rolePermission.createMany({
      data: editorPerms.map((perm) => ({
        roleId: editorRole.id,
        permissionId: perm.id,
      })),
      skipDuplicates: true,
    });
  }

  // Assign minimal permissions to MEMBER
  if (memberRole) {
    const memberPerms = allPermissions.filter((p) =>
      ['VIEW_POST'].includes(p.name)
    );

    await prisma.rolePermission.createMany({
      data: memberPerms.map((perm) => ({
        roleId: memberRole.id,
        permissionId: perm.id,
      })),
      skipDuplicates: true,
    });
  }

  console.log('✅ Permissions assigned to roles.');

  console.log('🌱 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
