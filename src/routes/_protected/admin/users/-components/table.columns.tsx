import { ColumnDef } from '@tanstack/react-table'
import { memo, useMemo } from 'react'
import { UserInfo } from '@/db/schemas/db.schema.user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { TableRowActions } from '@/components/shared/TableRowActions'
import { formatDate } from '@/lib/utils'
import { getUserAvatar, getUserBadgeByRole } from '@/lib/user.component'

export interface UseTableColumnsProps {
  currentUser: UserInfo
  onDelete: (row: UserInfo) => void
}

/**
 * Custom hook to build optimized table columns
 * Renamed from buildTableColumns to follow React Hooks naming convention
 */
export const useTableColumns = ({
  currentUser,
  onDelete,
}: UseTableColumnsProps): ColumnDef<UserInfo>[] => {
  // Helper functions for permission checks - memoized based on currentUser
  const canBeDeleted = useMemo(
    () => (row: UserInfo) => {
      return (
        row.id !== currentUser.id &&
        row.role !== 'super_admin' &&
        currentUser.role === 'super_admin'
      )
    },
    [currentUser.id, currentUser.role],
  )

  const canBeEdited = useMemo(
    () => (row: UserInfo) => {
      return (
        row.id !== currentUser.id &&
        row.role !== 'super_admin' &&
        currentUser.role === 'super_admin'
      )
    },
    [currentUser.id, currentUser.role],
  )

  // Memoize columns - only recreate when dependencies actually change
  return useMemo<ColumnDef<UserInfo>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => {
          return (
            <div className="flex w-[10px] items-center justify-center">
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomeRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value: boolean | 'indeterminate') => {
                  if (
                    !value ||
                    value === 'indeterminate' ||
                    (table.getIsSomePageRowsSelected() && value === true)
                  ) {
                    table.toggleAllPageRowsSelected(false)
                    return
                  }

                  table.getRowModel().rows.forEach((row) => {
                    if (canBeDeleted(row.original)) {
                      row.toggleSelected(true)
                    }
                  })
                }}
                aria-label="Select all"
              />
            </div>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="flex w-[10px] items-center justify-center">
              <Checkbox
                checked={row.getIsSelected()}
                disabled={!canBeDeleted(row.original)}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            </div>
          )
        },
        enableSorting: false,
        enableHiding: false,
        size: 20,
      },
      {
        header: ({ column }) => {
          return (
            <div className="flex items-center justify-start">
              <div className="flex-1 text-sm font-medium">Name</div>
              <SortButton
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
              />
            </div>
          )
        },
        accessorKey: 'name',
        enableSorting: true,
        enableHiding: true,
        size: 200,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              {getUserAvatar(row.original)}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{row.original.name}</div>
                  {row.original.id === currentUser.id && (
                    <Badge variant={'shade-purple'}>
                      <span className="text-xs">You</span>
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {row.original.email}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        header: () => <div className="text-center mr-4">Role</div>,
        accessorKey: 'role',
        size: 200,
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center gap-2">
              {getUserBadgeByRole(row.original.role)}
            </div>
          )
        },
      },
      {
        header: () => <div className="text-center mr-4">Status</div>,
        accessorKey: 'isActive',
        size: 120,
        cell: ({ row }) => {
          return row.original.isActive ? (
            <div className="text-center">
              <Badge variant={'shade-success'}>Active</Badge>
            </div>
          ) : (
            <div className="text-center">
              <Badge variant={'shade-danger'}>Inactive</Badge>
            </div>
          )
        },
      },
      {
        header: () => <div className="text-right">Created At</div>,
        accessorKey: 'createdAt',
        size: 120,
        cell: ({ row }) => {
          return (
            <div className="text-sm text-muted-foreground text-right">
              {formatDate(row.original.createdAt)}
            </div>
          )
        },
      },
      {
        header: () => <div className="text-right">Updated At</div>,
        accessorKey: 'updatedAt',
        size: 120,
        cell: ({ row }) => {
          return (
            <div className="text-right text-sm text-muted-foreground">
              {formatDate(row.original.updatedAt)}
            </div>
          )
        },
      },
      {
        header: () => <div className="text-right mr-4"></div>,
        accessorKey: 'actions',
        enableHiding: false,
        size: 60,
        cell: ({ row }) => {
          return (
            <div className="flex flex-1 justify-end">
              <TableRowActions
                viewPath={`/admin/users/${row.original.id.toString()}`}
                editPath={
                  canBeEdited(row.original)
                    ? `/admin/users/${row.original.id.toString()}/edit`
                    : undefined
                }
                canBeDeleted={canBeDeleted(row.original)}
                onDelete={() => onDelete?.(row.original)}
              />
            </div>
          )
        },
      },
    ],
    // Only recreate columns when these specific values change
    [canBeDeleted, canBeEdited, currentUser.id, onDelete],
  )
}

const SortButton = memo(({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground hover:bg-transparent"
    >
      <ArrowUpDown className="w-4 h-4" />
    </Button>
  )
})
