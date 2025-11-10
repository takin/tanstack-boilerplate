import { memo } from 'react'
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Link } from '@tanstack/react-router'

export interface TableRowActionsProps {
  viewPath?: string
  editPath?: string
  onDelete?: (event: React.MouseEvent<HTMLDivElement>) => void
  canBeDeleted?: boolean
}

function TableRowActionsComponent({
  viewPath,
  editPath,
  onDelete,
  canBeDeleted,
}: TableRowActionsProps): React.ReactElement | null {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          <EllipsisVerticalIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {viewPath && (
          <DropdownMenuItem className="cursor-pointer">
            <Link to={viewPath}>
              <div className="flex items-center gap-2">
                <EyeIcon className="w-4 h-4" />
                View
              </div>
            </Link>
          </DropdownMenuItem>
        )}
        {editPath && (
          <DropdownMenuItem className="cursor-pointer text-blue-600 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-600/10">
            <Link to={editPath}>
              <div className="flex items-center gap-2">
                <PencilIcon className="w-4 h-4 text-blue-600" />
                Edit
              </div>
            </Link>
          </DropdownMenuItem>
        )}
        {canBeDeleted && (
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={onDelete}
          >
            <TrashIcon className="w-4 h-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const TableRowActions = memo(
  TableRowActionsComponent,
) as typeof TableRowActionsComponent
