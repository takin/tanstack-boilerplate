import { db } from '@/db'
import { count, eq, SQL } from 'drizzle-orm'
import { dbSchemaUser, User, UserInfo } from '@/db/schemas'
import bcrypt from 'bcryptjs'

export const getUserById = async (id: string): Promise<UserInfo | null> => {
  const user = await db.query.dbSchemaUser.findFirst({
    where: eq(dbSchemaUser.id, id as string),
  })
  return user ?? null
}

export const getUserByEmail = async (
  email: string,
): Promise<UserInfo | null> => {
  const user = await db.query.dbSchemaUser.findFirst({
    where: eq(dbSchemaUser.email, email),
  })
  return user ?? null
}

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  const user = await db.query.dbSchemaUser.findFirst({
    where: eq(dbSchemaUser.email, email),
  })

  if (!user) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return null
  }
  return user
}

export const getUserList = async (
  offset: number,
  limit: number,
  whereClause?: SQL<typeof dbSchemaUser>,
): Promise<{
  rows: UserInfo[]
  rowCount: number
  pagination: { pageIndex: number; pageSize: number }
}> => {
  const users = await db.query.dbSchemaUser.findMany({
    offset,
    limit,
    where: whereClause ?? undefined,
  })

  console.log('users', users)

  const rowCount = await db
    .select({ count: count() })
    .from(dbSchemaUser)
    .where(whereClause ?? undefined)
    .execute()

  console.log('rowCount', rowCount)
  return {
    rows: users,
    rowCount: rowCount[0].count,
    pagination: {
      pageIndex: offset,
      pageSize: limit,
    },
  }
}
