import React, { useEffect, useState } from 'react'
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
import { Input } from '../ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ChevronDown, X } from 'lucide-react'

export interface ProperTableProps<T> {
  table: TableType<T>
  showZebraStripe?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
}

function TableComponent<T>({
  table,
  showZebraStripe = false,
  showSearch = true,
  searchPlaceholder = 'Search',
  searchValue,
  onSearchChange,
}: ProperTableProps<T>): React.ReactElement {
  const [search, setSearch] = useState(searchValue ?? '')
  const debouncedSearch = useDebounce(search)

  // Sync local state with prop if provided (controlled component)
  // Only sync when searchValue prop changes from external source (e.g., URL)
  useEffect(() => {
    if (searchValue !== undefined && searchValue !== search) {
      setSearch(searchValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  useEffect(() => {
    onSearchChange?.(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  const handleClearSearch = () => {
    setSearch('')
    onSearchChange?.('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {showSearch && (
          <div className="relative w-[55%]">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={search ? 'pr-9' : ''}
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-muted"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {typeof column.columnDef.header === 'function'
                    ? column.id.charAt(0).toUpperCase() + column.id.slice(1)
                    : column.columnDef.header}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-lg overflow-hidden py-4 px-6">
        <Table className="border-collapse table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const size = header.getSize()
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: size,
                        minWidth: size,
                        maxWidth: size,
                      }}
                      className="overflow-hidden"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  )
                })}
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
                className={`hover:bg-muted border-b border-gray-200 dark:border-neutral-700 ${showZebraStripe && index % 2 === 0 ? 'bg-muted/80' : 'bg-transparent'}`}
              >
                {row.getVisibleCells().map((cell) => {
                  const size = cell.column.getSize()
                  return (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: size,
                        minWidth: size,
                        maxWidth: size,
                      }}
                      className="overflow-hidden"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  )
                })}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getSelectedRowModel().rows.length} of{' '}
          {table.getRowModel().rows.length} row(s) selected
        </div>
        {table.getPageCount() > 1 && (
          <div>
            <div className="flex justify-end">
              <ProperPagination
                canPreviousPage={table.getCanPreviousPage()}
                canNextPage={table.getCanNextPage()}
                pageIndex={table.getState().pagination.pageIndex}
                pageCount={table.getPageCount()}
                rowCount={table.getRowCount()}
                onFirstPage={() => table.setPageIndex(0)}
                onPrevPage={() => {
                  table.setPageIndex(table.getState().pagination.pageIndex - 1)
                }}
                onNextPage={() => {
                  table.setPageIndex(table.getState().pagination.pageIndex + 1)
                }}
                onLastPage={() => {
                  table.setPageIndex(table.getPageCount() - 1)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const ProperTable = TableComponent
