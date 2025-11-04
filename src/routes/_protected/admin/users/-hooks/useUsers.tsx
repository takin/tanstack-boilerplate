import { UserInfo } from '@/db/schemas/db.schema.user'
import { getUserListFn } from '@/server/user.function'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

export interface UseUsersProps {
  currentUser: UserInfo
}

export interface UsersHookReturn {
  users: UserInfo[]
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
}

export function useUsers(currentUser: UserInfo): UsersHookReturn {
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [users, setUsers] = useState<UserInfo[]>([])

  const { data, isLoading, isError, error } = useQuery<UserInfo[]>({
    queryKey: ['users'],
    queryFn: () => getUserListFn(),
    staleTime: 1000 * 60 * 3, // 3 minutes
  })

  const canBeDeleted = (userId: string) => {
    const user = users.find((user) => user.id.toString() === userId)
    if (!user) return false

    return (
      user.id !== currentUser.id &&
      user.role !== 'super_admin' &&
      currentUser.role !== 'super_admin'
    )
  }

  const handleDeleteConfirmation = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const userId = event.currentTarget.dataset.userId
    if (!userId) return

    // Find the user from data
    const user = users.find((u) => u.id.toString() === userId)
    if (user) {
      setSelectedUser(user)
      setShowConfirmationDialog(true)
    }
  }

  const handleDelete = useCallback(() => {}, [selectedUser])

  useEffect(() => {
    setUsers(data ?? [])
  }, [data])

  return {
    users,
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
  }
}
