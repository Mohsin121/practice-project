import { PrismaClient } from '@prisma/client';
import { hashGenerator } from '../src/utils/hashGenerator';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Set to true/false to enable/disable each seeding operation

const SEED_CONFIG = {
  // ⚠️ WARNING: This will DELETE ALL DATA in your database!
  DROP_ALL_DATA: false,           // Set to true to drop all existing data before seeding

  SEED_ADMIN_USER: true,          // Create super admin user
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
    
    // await prisma.post.deleteMany({});
    // console.log('   ✓ Deleted all posts');
    
    // await prisma.group.deleteMany({});
    // console.log('   ✓ Deleted all groups');
    
    
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

 

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  
  // 🔒 Auto-reset ALL flags to false for safety
  try {
    const seedFilePath = path.join(__dirname, 'seed.ts');
    let fileContent = fs.readFileSync(seedFilePath, 'utf-8');
    
    // Replace all true flags with false in SEED_CONFIG
    const updatedContent = fileContent.replace(
      /(const SEED_CONFIG = \{[\s\S]*?\n\};)/,
      (match) => {
        return match
          .replace(/DROP_ALL_DATA:\s*true/g, 'DROP_ALL_DATA: false')   
      }
    );
    
    fs.writeFileSync(seedFilePath, updatedContent, 'utf-8');
    console.log('');
    console.log('🔒 AUTO-RESET: All flags have been set to false');
    console.log('   (Enable the flags you need before next run)');
  } catch (error) {
    console.warn('');
    console.warn('⚠️  Could not auto-reset flags:', error.message);
    console.log('   Please manually set flags to false after this run.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
