// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashGenerator } from '../src/utils/hashGenerator';

const prisma = new PrismaClient();

// Set to true/false to enable/disable each seeding operation

const SEED_CONFIG = {
  // ⚠️ WARNING: This will DELETE ALL DATA in your database!
  DROP_ALL_DATA: true,           // Set to true to drop all existing data before seeding

  SEED_ADMIN_USER: true,          // Create super admin user
  SEED_PERMISSIONS: false,         // Create permissions
  SEED_ROLES: false,               // Create group roles (OWNER, EDITOR, MEMBER)
  ASSIGN_PERMISSIONS_TO_ROLES: false, // Assign permissions to roles
};

// ============================================

async function main() {
  console.log('🌱 Starting seed process...');
  console.log('📋 Configuration:', SEED_CONFIG);
  console.log('');

  // ⚠️ DROP ALL DATA (if enabled)
  if (SEED_CONFIG.DROP_ALL_DATA) {
    console.log('⚠️  DROPPING ALL DATA...');
    
    // Delete in correct order to respect foreign key constraints
    await prisma.rolePermission.deleteMany({});
    console.log('   ✓ Deleted all role permissions');
    
    await prisma.groupMember.deleteMany({});
    console.log('   ✓ Deleted all group members');
    
    // await prisma.post.deleteMany({});
    // console.log('   ✓ Deleted all posts');
    
    // await prisma.group.deleteMany({});
    // console.log('   ✓ Deleted all groups');
    
    await prisma.permission.deleteMany({});
    console.log('   ✓ Deleted all permissions');
    
    await prisma.role.deleteMany({});
    console.log('   ✓ Deleted all roles');
    
    // await prisma.user.deleteMany({});
    // console.log('   ✓ Deleted all users');
    
    console.log('✅ All data dropped successfully!');
    console.log('');
  }

  // 1️⃣ --- Seed Admin User ---
  if (SEED_CONFIG.SEED_ADMIN_USER) {
    await prisma.user.upsert({
      where: { email: 'admin@system.com' },
      update: {},
      create: {
        email: 'admin@system.com',
        hash: await hashGenerator('1234'),
        name: 'System Admin',
        role: "SUPER_ADMIN",
      },
    });
    console.log('✅ Super Admin User seeded.');
  } else {
    console.log('⏭️  Skipped: Admin User seeding');
  }

  // 2️⃣ --- Seed Permissions ---
  if (SEED_CONFIG.SEED_PERMISSIONS) {
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
  } else {
    console.log('⏭️  Skipped: Permissions seeding');
  }

  // 3️⃣ --- Seed Roles ---
  if (SEED_CONFIG.SEED_ROLES) {
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
  } else {
    console.log('⏭️  Skipped: Roles seeding');
  }

  

  // 4️⃣ --- Assign permissions to roles ---
  if (SEED_CONFIG.ASSIGN_PERMISSIONS_TO_ROLES) {
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
  } else {
    console.log('⏭️  Skipped: Permission assignment to roles');
  }

  console.log('');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
