import { db } from '@/db'
import { asc, count, desc, eq, like, or, SQLWrapper } from 'drizzle-orm'
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

interface OrderBy {
  id: string
  desc: boolean
}

export const getUserList = async (
  offset: number,
  limit: number,
  orderBy?: Array<OrderBy>,
  search?: string,
): Promise<{
  rows: UserInfo[]
  rowCount: number
  pagination: { pageIndex: number; pageSize: number }
  sorting: Array<OrderBy>
  search: string
}> => {
  const preapredOrderBy = []

  if (orderBy) {
    for (const sort of orderBy) {
      if (sort.desc === true) {
        preapredOrderBy.push(
          desc(
            dbSchemaUser[sort.id as keyof typeof dbSchemaUser] as SQLWrapper,
          ),
        )
      } else {
        preapredOrderBy.push(
          asc(dbSchemaUser[sort.id as keyof typeof dbSchemaUser] as SQLWrapper),
        )
      }
    }
  }

  // Build WHERE clause for search filter
  const whereClause = search
    ? or(
        like(dbSchemaUser.name, `%${search}%`),
        like(dbSchemaUser.email, `%${search}%`),
      )
    : undefined

  // Get filtered users with pagination and sorting
  const usersQuery = db.select().from(dbSchemaUser)

  if (whereClause) {
    usersQuery.where(whereClause)
  }

  if (preapredOrderBy.length > 0) {
    usersQuery.orderBy(...preapredOrderBy)
  }

  const users = await usersQuery.limit(limit).offset(offset)

  // Get total count with same filter
  const countQuery = db.select({ count: count() }).from(dbSchemaUser)

  if (whereClause) {
    countQuery.where(whereClause)
  }

  const rowCountResult = await countQuery.execute()

  return {
    rows: users,
    rowCount: rowCountResult[0].count,
    pagination: {
      pageIndex: offset,
      pageSize: limit,
    },
    sorting: orderBy ?? [
      {
        id: 'createdAt',
        desc: true,
      },
    ],
    search: search ?? '',
  }
}
