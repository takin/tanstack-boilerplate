import { createServerFn } from '@tanstack/react-start'
import { UserInfo } from '@/db/schemas/db.schema.user'
import { getUserById, getUserList } from '@/services/service.user'
import { z } from 'zod'
import { PaginationState } from '@tanstack/react-table'

export const getUserListFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      pagination: z.object({ pageIndex: z.number(), pageSize: z.number() }),
    }),
  )
  .handler(
    async ({
      data,
    }): Promise<{
      rows: UserInfo[]
      rowCount: number
      pagination: PaginationState
    }> => {
      return await getUserList(
        data.pagination.pageIndex,
        data.pagination.pageSize,
      )
    },
  )

export const getUserByIdFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.uuid() }))
  .handler(async ({ data }) => {
    return await getUserById(data.userId)
  })
