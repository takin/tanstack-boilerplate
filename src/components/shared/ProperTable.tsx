import React, { useEffect, useEffectEvent, useState, useMemo } from 'react'
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
import {
  AlertTriangleIcon,
  ChevronDown,
  RotateCcwIcon,
  Trash2,
  X,
} from 'lucide-react'
import { TableSkeleton } from '@/routes/_protected/admin/users/-components/table.skeleton'
import { Skeleton } from '../ui/skeleton'
import { ProperAlert } from './ProperAlert'

export interface ProperTableProps<T> {
  table: TableType<T>
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  showZebraStripe?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onRefresh?: () => void
}

function TableComponent<T>({
  table,
  isLoading = false,
  isError = false,
  error = null,
  showZebraStripe = false,
  showSearch = true,
  searchPlaceholder = 'Search',
  searchValue,
  onSearchChange,
  onRefresh,
}: ProperTableProps<T>): React.ReactElement {
  const [search, setSearch] = useState(searchValue ?? '')
  const debouncedSearch = useDebounce(search)
  const [open, setOpen] = useState(false)

  const searchEffectEvent = useEffectEvent((value?: string) => {
    if (value !== undefined && value !== search) {
      setSearch(value)
    }
  })

  const handleSearchChange = useEffectEvent((value: string) => {
    onSearchChange?.(value)
  })

  useEffect(() => {
    searchEffectEvent(searchValue)
  }, [searchValue])

  useEffect(() => {
    handleSearchChange(debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const handleClearSearch = useEffectEvent(() => {
    setSearch('')
    onSearchChange?.('')
  })

  // Memoize expensive table computations to prevent unnecessary re-renders
  const selectedRowsCount = useMemo(
    () => table.getSelectedRowModel().rows.length,
    [table],
  )

  const visibleColumns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanHide()),
    [table],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {showSearch && (
          <div className="relative w-[45%]">
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
        <div className="flex items-center gap-2">
          <ProperAlert
            open={open}
            setOpen={(open) => {
              setOpen(open)
            }}
            onConfirm={() => {}}
            onCancel={() => {
              setOpen(false)
            }}
            title="Delete Selected Rows"
            description={`Are you sure you want to delete ${selectedRowsCount} row(s)? This action cannot be undone.`}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpen(true)
            }}
            disabled={selectedRowsCount === 0}
          >
            <Trash2 className="w-4 h-4" />
            Delete All
          </Button>
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
              {visibleColumns.map((column) => (
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
            {isLoading ? (
              <TableSkeleton
                columnWidths={table
                  .getAllColumns()
                  .filter((column) => column.getIsVisible())
                  .map((column) => column.getSize() ?? 0)}
              />
            ) : isError ? (
              <TableRow key="error-row">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangleIcon className="w-8 h-8 text-destructive" />
                    <h3 className="text-sm font-medium text-destructive">
                      LOADING ERROR
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {error?.message ??
                        'An error occurred while loading the table.'}
                    </p>
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onRefresh?.()
                        }}
                      >
                        <RotateCcwIcon className="w-4 h-4" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, index) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Separator />
      {isLoading || isError ? (
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[250px]" />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedRowsCount} of {table.getRowModel().rows.length} row(s)
            selected
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
                  onFirstPage={() => {
                    table.setPageIndex(0)
                    table.toggleAllPageRowsSelected(false)
                  }}
                  onPrevPage={() => {
                    table.setPageIndex(
                      table.getState().pagination.pageIndex - 1,
                    )
                    table.toggleAllPageRowsSelected(false)
                  }}
                  onNextPage={() => {
                    table.setPageIndex(
                      table.getState().pagination.pageIndex + 1,
                    )
                    table.toggleAllPageRowsSelected(false)
                  }}
                  onLastPage={() => {
                    table.setPageIndex(table.getPageCount() - 1)
                    table.toggleAllPageRowsSelected(false)
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const ProperTable = TableComponent
