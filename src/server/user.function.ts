import { createServerFn } from '@tanstack/react-start'
import { UserInfo } from '@/db/schemas/db.schema.user'
import { getUserById, getUserList } from '@/services/service.user'
import { z } from 'zod'
import { PaginationState, SortingState } from '@tanstack/react-table'

export const getUserListFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      pagination: z.object({ pageIndex: z.number(), pageSize: z.number() }),
      sorting: z
        .array(z.object({ id: z.string(), desc: z.boolean() }))
        .optional(),
      search: z.string().optional(),
    }),
  )
  .handler(
    async ({
      data,
    }): Promise<{
      rows: UserInfo[]
      rowCount: number
      pagination: PaginationState
      sorting: SortingState
      search: string
    }> => {
      const offset = data.pagination.pageIndex * data.pagination.pageSize
      const limit = data.pagination.pageSize

      return await getUserList(offset, limit, data.sorting, data.search)
    },
  )

export const getUserByIdFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.uuid() }))
  .handler(async ({ data }) => {
    return await getUserById(data.userId)
  })
