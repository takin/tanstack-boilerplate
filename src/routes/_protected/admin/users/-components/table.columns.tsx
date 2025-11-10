import { ColumnDef } from '@tanstack/react-table'
import { memo, useCallback, useMemo } from 'react'
import { UserInfo } from '@/db/schemas/db.schema.user'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { TableRowActions } from '@/components/shared/TableRowActions'
export interface BuildTableColumnsProps {
  currentUser: UserInfo
  users: UserInfo[]
  onDelete: (row: UserInfo) => void
}

export const buildTableColumns = ({
  currentUser,
  users,
  onDelete,
}: BuildTableColumnsProps): ColumnDef<UserInfo>[] => {
  const canBeDeleted = useCallback(
    (row: UserInfo) => {
      return (
        row.id !== currentUser.id &&
        row.role !== 'super_admin' &&
        currentUser.role !== 'super_admin'
      )
    },
    [currentUser],
  )

  const canBeEdited = useCallback(
    (row: UserInfo) => {
      return (
        row.id !== currentUser.id &&
        row.role !== 'super_admin' &&
        currentUser.role !== 'super_admin'
      )
    },
    [currentUser],
  )

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
                onCheckedChange={(value: boolean | 'indeterminate') =>
                  table.toggleAllPageRowsSelected(!!value)
                }
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
        sortingFn: (rowA, rowB) => {
          return rowA.original.name.localeCompare(rowB.original.name)
        },
        accessorKey: 'name',
        enableSorting: true,
        enableHiding: true,
        size: 200,
        cell: ({ row }) => {
          let className = ''
          switch (row.original.role) {
            case 'super_admin':
              className =
                'bg-purple-500/10 text-purple-600 border border-purple-500/20'
              break
            case 'admin':
              className =
                'bg-blue-500/10 text-blue-600 border border-blue-500/20'
              break
            case 'user':
              className =
                'bg-gray-500/10 text-gray-600 border border-gray-500/20'
              break
            default:
              className =
                'bg-muted/50 text-muted-foreground border border-muted/20'
          }

          return (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback className={className}>
                  {row.original.name
                    .split(' ')
                    .map((name) => name.charAt(0).toUpperCase())
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{row.original.name}</span>
                <span className="text-xs text-muted-foreground">
                  {row.original.email}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        header: 'Role',
        accessorKey: 'role',
        size: 200,
        cell: ({ row }) => {
          let badge: React.ReactNode = (
            <Badge variant={'shade-gray'}>User</Badge>
          )
          switch (row.original.role) {
            case 'super_admin':
              badge = <Badge variant={'shade-purple'}>Super Admin</Badge>
              break
            case 'admin':
              badge = <Badge variant={'shade-info'}>Admin</Badge>
              break
            default:
              badge = <Badge variant={'shade-gray'}>User</Badge>
              break
          }

          return <div className="flex items-center gap-2">{badge}</div>
        },
      },
      {
        header: 'Status',
        accessorKey: 'isActive',
        size: 120,
        cell: ({ row }) => {
          return row.original.isActive ? (
            <Badge variant={'shade-success'}>Active</Badge>
          ) : (
            <Badge variant={'shade-danger'}>Inactive</Badge>
          )
        },
      },
      {
        header: () => <div className="text-right mr-4">Actions</div>,
        accessorKey: 'actions',
        enableHiding: false,
        size: 150,
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
    [users],
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
