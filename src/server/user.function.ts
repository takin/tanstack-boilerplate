import { createServerFn } from '@tanstack/react-start'
import { UserInfo } from '@/db/schemas/db.schema.user'
import { getUserById, getUserList } from '@/services/service.user'
import { z } from 'zod'

export const getUserListFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserInfo[]> => {
    return await getUserList()
  },
)

export const getUserByIdFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.uuid() }))
  .handler(async ({ data }) => {
    return await getUserById(data.userId)
  })
