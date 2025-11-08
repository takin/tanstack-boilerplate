import React from 'react'
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { Button } from '../ui/button'

export interface ProperPaginationProps {
  onFirstPage: () => void
  onPrevPage: () => void
  onNextPage: () => void
  onLastPage: () => void
  canPreviousPage: boolean
  canNextPage: boolean
  pageIndex: number
  pageCount: number
  rowCount: number
}

function PaginationComponent({
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageCount,
  rowCount,
}: ProperPaginationProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFirstPage}
          disabled={!canPreviousPage}
        >
          <ChevronFirst className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!canPreviousPage}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {pageIndex + 1} of {pageCount} of {rowCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!canNextPage}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onLastPage}
          disabled={!canNextPage}
        >
          <ChevronLast className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export const ProperPagination = React.memo(
  PaginationComponent,
  (prevProps, nextProps) => {
    if (
      prevProps.pageIndex === nextProps.pageIndex &&
      prevProps.pageCount === nextProps.pageCount &&
      prevProps.rowCount === nextProps.rowCount
    ) {
      return true
    }
    return false
  },
) as typeof PaginationComponent
