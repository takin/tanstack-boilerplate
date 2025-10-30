import { db } from './db'
import { dbSchemaUser } from './db/schemas/db.schema.user'
import bcrypt from 'bcryptjs'

export async function seedUsers() {
  console.log('🌱 Seeding users...')

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10)

  const users = [
    {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'super_admin' as const,
      isActive: true,
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin' as const,
      isActive: true,
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: 'user' as const,
      isActive: true,
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      role: 'user' as const,
      isActive: true,
    },
    {
      name: 'Inactive User',
      email: 'inactive@example.com',
      password: hashedPassword,
      role: 'user' as const,
      isActive: false,
    },
  ]

  try {
    // Insert users
    await db.insert(dbSchemaUser).values(users)
    console.log('✅ Users seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    throw error
  }
}

// Run seeds if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers()
    .then(() => {
      console.log('🎉 All seeds completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}
