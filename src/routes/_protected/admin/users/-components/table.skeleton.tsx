import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export interface TableSkeletonProps {
  columnWidths: number[]
  rowCount?: number
}

export function TableSkeleton({
  columnWidths,
  rowCount = 3,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index}>
          {columnWidths.map((width, columnIndex) => (
            <TableCell
              key={columnIndex}
              style={{ width: width, minWidth: width, maxWidth: width }}
            >
              <Skeleton className="h-10 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
