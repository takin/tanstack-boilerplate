import { useEffect } from 'react'
import { UserInfo } from '@/db/schemas/db.schema.user'
import { getUserListFn } from '@/server/user.function'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  Table,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useRef, useState } from 'react'
import { buildTableColumns } from '../-components/table.columns'
import { useNavigate, useRouterState } from '@tanstack/react-router'

export interface UseUsersProps {
  currentUser: UserInfo
}

export interface UsersHookReturn {
  users: UserInfo[]
  table: Table<UserInfo>
  isLoading: boolean
  isError: boolean
  error: Error | null
  selectedUserToDelete: UserInfo | null
  setSelectedUserToDelete: (user: UserInfo | null) => void
  handleDelete: () => void
  handleSearch: (value: string) => void
  searchValue: string
  pagination: PaginationState
  setPagination: OnChangeFn<PaginationState>
  rowCount: number
  handleRefresh: () => void
}

export interface UrlParams {
  q?: string
  pageIndex?: number
  pageSize?: number
  sortBy?: string
  sortDesc?: boolean
}

export function useUsers(currentUser: UserInfo): UsersHookReturn {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const queryClient = useQueryClient()

  /**
   * Temporary state for delete confirmation
   */
  const [selectedUserToDelete, setSelectedUserToDelete] =
    useState<UserInfo | null>(null)

  const currentUrlSearchParamsString = routerState.location.searchStr

  const getInitialUrlParams = () => {
    const search = routerState.location.search as unknown as Partial<UrlParams>
    return {
      q: search.q,
      pageIndex: search.pageIndex,
      pageSize: search.pageSize,
      sortBy: search.sortBy,
      sortDesc: search.sortDesc,
    }
  }

  const [urlParams, setUrlParams] = useState<UrlParams>(() =>
    getInitialUrlParams(),
  )

  const getInitialPagination = (): PaginationState => {
    return {
      pageIndex: urlParams.pageIndex ?? 0,
      pageSize: urlParams.pageSize ?? 3,
    }
  }

  const [pagination, setPagination] =
    useState<PaginationState>(getInitialPagination)

  const getInitialSorting = (): SortingState => {
    if (!urlParams.sortBy) return []
    return [
      {
        id: urlParams.sortBy ?? 'created_at',
        desc: urlParams.sortDesc ?? false,
      },
    ]
  }

  const [sorting, setSorting] = useState<SortingState>(getInitialSorting)

  // Track if URL update is from internal state change to avoid infinite loop
  const isInternalUpdate = useRef(false)

  // Track current pathname to detect route changes
  const currentPathname = useRef(routerState.location.pathname)

  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (update) => {
      setPagination((prev) => {
        const newPagination =
          typeof update === 'function' ? update(prev) : update
        setUrlParams((prevParams) => ({
          ...prevParams,
          pageIndex: newPagination.pageIndex,
          pageSize: newPagination.pageSize,
        }))
        return newPagination
      })
    },
    [],
  )

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (update) => {
      setSorting((prev) => {
        const newSorting = typeof update === 'function' ? update(prev) : update
        const firstSort = newSorting[0]

        setUrlParams((prevParams) => {
          if (firstSort) {
            return {
              ...prevParams,
              sortBy: firstSort.id,
              sortDesc: firstSort.desc,
            }
          } else {
            // Remove sort params when no sorting
            const { sortBy, sortDesc, ...rest } = prevParams
            return rest
          }
        })

        return newSorting
      })
    },
    [],
  )

  const { data, isLoading, isError, error } = useQuery<{
    rows: UserInfo[]
    rowCount: number
    pagination: PaginationState
  }>({
    queryKey: ['users', pagination, sorting, currentUrlSearchParamsString],
    queryFn: () =>
      getUserListFn({
        data: {
          pagination,
          sorting,
          search: urlParams.q,
        },
      }),
    staleTime: 1000 * 60 * 3, // 3 minutes
  })

  // Move handleDeleteConfirmation before columns
  const handleDeleteConfirmation = useCallback(
    (row: UserInfo) => {
      setSelectedUserToDelete(row)
      // setShowConfirmationDialog(true)
    },
    [setSelectedUserToDelete],
  )

  // Now columns can safely reference the memoized functions
  const columns = buildTableColumns({
    currentUser,
    users: data?.rows ?? [],
    onDelete: handleDeleteConfirmation,
  })

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    rowCount: data?.rowCount ?? 0,
    state: {
      pagination,
      sorting,
    },
  })

  const handleDelete = useCallback(() => {}, [selectedUserToDelete])

  const handleSearch = useCallback((value: string) => {
    setUrlParams((prevParams) => {
      if (value === prevParams.q) return prevParams
      if (value === '') {
        const { q, ...rest } = prevParams
        return rest
      }
      return { ...prevParams, q: value, pageIndex: 0 } // Reset to first page on search
    })
  }, [])

  // Sync URL params to URL when state changes
  // Only sync when we're still on the same route
  // useEffect(() => {
  //   // Only sync if we're still on the users route
  //   if (routerState.location.pathname !== '/admin/users') {
  //     return
  //   }

  //   isInternalUpdate.current = true
  //   navigate({
  //     to: routerState.location.pathname,
  //     search: urlParams,
  //     replace: true,
  //   })
  //   // Reset flag after navigation
  //   setTimeout(() => {
  //     isInternalUpdate.current = false
  //   }, 0)
  // }, [urlParams, navigate, routerState.location.pathname])

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }, [queryClient])

  // Clear search params when navigating to a different route
  // useEffect(() => {
  //   const newPathname = routerState.location.pathname

  //   // If pathname changed and we're no longer on users route, clear search params
  //   if (
  //     currentPathname.current !== newPathname &&
  //     newPathname !== '/admin/users'
  //   ) {
  //     // Reset state to default when leaving the route
  //     setUrlParams({})
  //     setPagination({ pageIndex: 0, pageSize: 3 })
  //     setSorting([])
  //   }

  //   currentPathname.current = newPathname
  // }, [routerState.location.pathname])

  // Sync URL to state when URL changes externally (e.g., browser back/forward)
  // Only sync when we're on the users route
  // useEffect(() => {
  //   // Skip if we're not on the users route
  //   if (routerState.location.pathname !== '/admin/users') {
  //     return
  //   }

  //   // Skip if this is an internal update
  //   if (isInternalUpdate.current) return

  //   const search = routerState.location.search as unknown as Partial<UrlParams>
  //   const urlParamsFromUrl: UrlParams = {
  //     q: search.q,
  //     pageIndex: search.pageIndex,
  //     pageSize: search.pageSize,
  //     sortBy: search.sortBy,
  //     sortDesc: search.sortDesc,
  //   }

  //   // Only update if URL params actually changed
  //   const hasChanged =
  //     urlParams.q !== urlParamsFromUrl.q ||
  //     urlParams.pageIndex !== urlParamsFromUrl.pageIndex ||
  //     urlParams.pageSize !== urlParamsFromUrl.pageSize ||
  //     urlParams.sortBy !== urlParamsFromUrl.sortBy ||
  //     urlParams.sortDesc !== urlParamsFromUrl.sortDesc

  //   if (hasChanged) {
  //     setUrlParams(urlParamsFromUrl)

  //     // Update pagination if changed
  //     if (
  //       urlParams.pageIndex !== urlParamsFromUrl.pageIndex ||
  //       urlParams.pageSize !== urlParamsFromUrl.pageSize
  //     ) {
  //       setPagination({
  //         pageIndex: urlParamsFromUrl.pageIndex ?? 0,
  //         pageSize: urlParamsFromUrl.pageSize ?? 3,
  //       })
  //     }

  //     // Update sorting if changed
  //     if (
  //       urlParams.sortBy !== urlParamsFromUrl.sortBy ||
  //       urlParams.sortDesc !== urlParamsFromUrl.sortDesc
  //     ) {
  //       if (urlParamsFromUrl.sortBy) {
  //         setSorting([
  //           {
  //             id: urlParamsFromUrl.sortBy,
  //             desc: urlParamsFromUrl.sortDesc ?? false,
  //           },
  //         ])
  //       } else {
  //         setSorting([])
  //       }
  //     }
  //   }
  // }, [routerState.location.searchStr, routerState.location.pathname])

  console.log('it was here', data)

  return {
    users: data?.rows ?? [],
    table,
    isLoading,
    isError,
    error,
    selectedUserToDelete,
    setSelectedUserToDelete,
    handleDelete,
    handleSearch,
    searchValue: urlParams.q ?? '',
    pagination,
    setPagination,
    rowCount: data?.rowCount ?? 0,
    handleRefresh,
  }
}
