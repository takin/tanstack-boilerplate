import { UserInfo } from '@/db/schemas/db.schema.user'
import { getUserListFn } from '@/server/user.function'
import { useQuery } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  Table,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { buildTableColumns } from '../-components/table.columns'

export interface UseUsersProps {
  currentUser: UserInfo
}

export interface UsersHookReturn {
  users: UserInfo[]
  table: Table<UserInfo>
  isLoading: boolean
  isError: boolean
  error: Error | null
  showConfirmationDialog: boolean
  setShowConfirmationDialog: (show: boolean) => void
  selectedUser: UserInfo | null
  setSelectedUser: (user: UserInfo | null) => void
  canBeDeleted: (userId: string) => boolean
  handleDeleteConfirmation: (event: React.MouseEvent<HTMLButtonElement>) => void
  handleDelete: () => void
  pagination: PaginationState
  setPagination: OnChangeFn<PaginationState>
  rowCount: number
}

export function useUsers(currentUser: UserInfo): UsersHookReturn {
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

  const defaultPagination = useMemo(() => ({ pageIndex: 0, pageSize: 2 }), [])

  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination)

  const { data, isLoading, isError, error } = useQuery<{
    rows: UserInfo[]
    rowCount: number
    pagination: PaginationState
  }>({
    queryKey: ['users', pagination],
    queryFn: () =>
      getUserListFn({
        data: {
          pagination,
        },
      }),
    staleTime: 1000 * 60 * 3, // 3 minutes
  })

  // Move canBeDeleted before columns
  const canBeDeleted = useCallback(
    (userId: string) => {
      const user = data?.rows.find((user) => user.id.toString() === userId)
      if (!user) return false

      return (
        user.id !== currentUser.id &&
        user.role !== 'super_admin' &&
        currentUser.role !== 'super_admin'
      )
    },
    [data?.rows, currentUser],
  )

  // Move handleDeleteConfirmation before columns
  const handleDeleteConfirmation = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const userId = event.currentTarget.dataset.userId
      if (!userId) return

      // Find the user from data
      const user = data?.rows.find((u) => u.id.toString() === userId)
      if (user) {
        setSelectedUser(user)
        setShowConfirmationDialog(true)
      }
    },
    [data?.rows],
  )

  // Now columns can safely reference the memoized functions
  const columns = buildTableColumns({
    users: data?.rows ?? [],
    onDelete: handleDeleteConfirmation,
    canBeDeleted,
  })

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    debugTable: true,
    rowCount: data?.rowCount ?? 0,
    state: {
      pagination,
    },
  })

  const handleDelete = useCallback(() => {}, [selectedUser])

  return {
    users: data?.rows ?? [],
    table,
    isLoading,
    isError,
    error,
    canBeDeleted,
    showConfirmationDialog,
    selectedUser,
    setSelectedUser,
    setShowConfirmationDialog,
    handleDeleteConfirmation,
    handleDelete,
    pagination,
    setPagination,
    rowCount: data?.rowCount ?? 0,
  }
}
