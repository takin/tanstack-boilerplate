import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { UserInfo } from '@/db/schemas/db.schema.user'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react'

export interface BuildTableColumnsProps {
  users: UserInfo[]
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void
  canBeDeleted: (userId: string) => boolean
}

export const buildTableColumns = ({
  users,
  onDelete,
  canBeDeleted,
}: BuildTableColumnsProps): ColumnDef<UserInfo>[] =>
  useMemo<ColumnDef<UserInfo>[]>(
    () => [
      {
        header: 'User',
        sortingFn: (rowA, rowB) => {
          return rowA.original.name.localeCompare(rowB.original.name)
        },
        accessorKey: 'name',
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
        cell: ({ row }) => {
          switch (row.original.role) {
            case 'super_admin':
              return <Badge variant={'shade-purple'}>Super Admin</Badge>
            case 'admin':
              return <Badge variant={'shade-info'}>Admin</Badge>
            case 'user':
              return <Badge variant={'shade-gray'}>User</Badge>
          }
        },
      },
      {
        header: 'Status',
        accessorKey: 'isActive',
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
        cell: ({ row }) => {
          return (
            <div className="flex gap-2 justify-end items-center">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  to={'/admin/users/$userId'}
                  params={{ userId: row.original.id.toString() }}
                >
                  <EyeIcon className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-blue-600 hover:text-blue-600/80 hover:bg-blue-600/10"
              >
                <Link
                  to={'/admin/users/$userId/edit'}
                  params={{ userId: row.original.id.toString() }}
                >
                  <PencilIcon className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={!canBeDeleted(row.original.id.toString())}
                onClick={onDelete}
                data-user-id={row.original.id.toString()}
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [users],
  )
