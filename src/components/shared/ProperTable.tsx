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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

export interface ProperTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  showZebraStripe?: boolean
}

function TableComponent<T>({
  data,
  columns,
  showZebraStripe = false,
}: ProperTableProps<T>): React.ReactElement {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
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
  )
}

export const ProperTable = React.memo(
  TableComponent,
  (prevProps, nextProps) => {
    if (
      prevProps.data === nextProps.data &&
      prevProps.columns === nextProps.columns
    ) {
      return true
    }

    if (prevProps.data.length !== nextProps.data.length) {
      return false
    }

    if (prevProps.data.length !== nextProps.data.length) {
      return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
    }

    return prevProps.columns === nextProps.columns
  },
) as typeof TableComponent
