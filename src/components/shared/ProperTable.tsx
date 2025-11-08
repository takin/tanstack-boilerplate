import React from 'react'
import { motion } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { type Table as TableType, flexRender } from '@tanstack/react-table'
import { Separator } from '@/components/ui/separator'
import { ProperPagination } from './ProperPagination'

export interface ProperTableProps<T> {
  table: TableType<T>
  showZebraStripe?: boolean
}

function TableComponent<T>({
  table,
  showZebraStripe = false,
}: ProperTableProps<T>): React.ReactElement {
  const handlerFirstPage = () => {
    table.setPageIndex(0)
  }
  const handlerPrevPage = () => {
    table.setPageIndex(table.getState().pagination.pageIndex - 1)
  }
  const handlerNextPage = () => {
    table.setPageIndex(table.getState().pagination.pageIndex + 1)
  }
  const handlerLastPage = () => {
    table.setPageIndex(table.getPageCount() - 1)
  }
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: row.index * 0.05 }}
              className={`hover:bg-muted ${showZebraStripe && index % 2 === 0 ? 'bg-muted/80' : 'bg-transparent'}`}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      <Separator />
      <div className="flex justify-end">
        <ProperPagination
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          rowCount={table.getRowCount()}
          onFirstPage={handlerFirstPage}
          onPrevPage={handlerPrevPage}
          onNextPage={handlerNextPage}
          onLastPage={handlerLastPage}
        />
      </div>
    </div>
  )
}

// export const ProperTable = React.memo(
//   TableComponent,
//   (prevProps, nextProps) => {
//     if (
//       prevProps.data === nextProps.data &&
//       prevProps.columns === nextProps.columns
//     ) {
//       return true
//     }

//     if (prevProps.data.length !== nextProps.data.length) {
//       return false
//     }

//     if (prevProps.data.length !== nextProps.data.length) {
//       return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
//     }

//     return prevProps.columns === nextProps.columns
//   },
// ) as typeof TableComponent

export const ProperTable = TableComponent
