import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const dbSchemaUserRole = pgEnum('user_role', [
  'super_admin',
  'admin',
  'user',
])

export const dbSchemaUser = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    role: dbSchemaUserRole('role').notNull().default('user'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    unique('uq_users_email').on(table.email),
    index('idx_users_email').on(table.email),
  ],
)

export type User = typeof dbSchemaUser.$inferSelect
export type UserInfo = Omit<typeof dbSchemaUser.$inferSelect, 'password'>
export type NewUser = typeof dbSchemaUser.$inferInsert
export type UserAuth = Pick<
  typeof dbSchemaUser.$inferSelect,
  'email' | 'password'
>
