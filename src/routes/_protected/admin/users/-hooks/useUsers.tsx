import { useEffect, useEffectEvent, useMemo } from 'react'
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
import { useTableColumns } from '../-components/table.columns'
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

  // Use ref to store initial search params to avoid hook ordering issues
  const initialSearchRef = useRef(
    routerState.location.search as unknown as Partial<UrlParams>,
  )

  // Initialize states with lazy initializers for consistency
  const [urlParams, setUrlParams] = useState<UrlParams>(() => {
    const search = initialSearchRef.current
    return {
      q: search.q,
      pageIndex: search.pageIndex,
      pageSize: search.pageSize,
      sortBy: search.sortBy,
      sortDesc: search.sortDesc,
    }
  })

  const [pagination, setPagination] = useState<PaginationState>(() => {
    const search = initialSearchRef.current
    return {
      pageIndex: search.pageIndex ?? 0,
      pageSize: search.pageSize ?? 3,
    }
  })

  const [sorting, setSorting] = useState<SortingState>(() => {
    const search = initialSearchRef.current
    if (!search.sortBy) return []
    return [
      {
        id: search.sortBy ?? 'created_at',
        desc: search.sortDesc ?? false,
      },
    ]
  })

  // Track if URL update is from internal state change to avoid infinite loop
  const isInternalUpdate = useRef(false)

  // Track current pathname to detect route changes
  const currentPathname = useRef(routerState.location.pathname)

  // Track if this is the initial mount to prevent unnecessary sync
  const isInitialMount = useRef(true)

  // Mark initial mount as complete after first render
  useEffect(() => {
    // Use setTimeout to ensure this runs after all initial effects
    const timer = setTimeout(() => {
      isInitialMount.current = false
    }, 0)
    return () => clearTimeout(timer)
  }, [])

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
  const handleDeleteConfirmation = useCallback((row: UserInfo) => {
    setSelectedUserToDelete(row)
    // setShowConfirmationDialog(true)
  }, [])

  // Memoize data arrays to prevent unnecessary re-renders
  const tableData = useMemo(() => data?.rows ?? [], [data?.rows])
  const rowCount = useMemo(() => data?.rowCount ?? 0, [data?.rowCount])

  // Build table columns using optimized hook
  // Columns are memoized and only recreate when dependencies change
  const columns = useTableColumns({
    currentUser,
    onDelete: handleDeleteConfirmation,
  })

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    rowCount,
    state: {
      pagination,
      sorting,
    },
  })

  const handleDelete = useCallback(() => {}, [])

  const handleSearch = useCallback((value: string) => {
    setUrlParams((prevParams) => {
      // Skip if search value hasn't changed
      if (value === prevParams.q) return prevParams

      // Search is changing, reset pagination to first page
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }))

      if (value === '') {
        // Remove search param and reset to first page
        const { q, ...rest } = prevParams
        return { ...rest, pageIndex: 0 }
      }
      // Set search param and reset to first page
      return { ...prevParams, q: value, pageIndex: 0 }
    })
  }, [])

  // Sync URL params to URL when state changes
  // Using useEffectEvent to avoid circular dependency
  const syncStateToUrl = useEffectEvent((urlParams: UrlParams) => {
    // Only sync if we're still on the users route
    if (routerState.location.pathname !== '/admin/users') {
      return
    }

    // Skip if this is already an internal update in progress
    if (isInternalUpdate.current) {
      return
    }

    // Check if URL actually needs to be updated
    const currentSearch = routerState.location
      .search as unknown as Partial<UrlParams>
    const needsUpdate =
      currentSearch.q !== urlParams.q ||
      currentSearch.pageIndex !== urlParams.pageIndex ||
      currentSearch.pageSize !== urlParams.pageSize ||
      currentSearch.sortBy !== urlParams.sortBy ||
      currentSearch.sortDesc !== urlParams.sortDesc

    if (!needsUpdate) {
      return
    }

    isInternalUpdate.current = true
    navigate({
      to: routerState.location.pathname,
      search: urlParams,
      replace: true,
    })
    // Reset flag after navigation with delay to allow router to process
    setTimeout(() => {
      isInternalUpdate.current = false
    }, 150)
  })

  // Sync URL to state when URL changes externally (e.g., browser back/forward)
  // Using useEffectEvent to avoid circular dependency
  const syncUrlToState = useEffectEvent(() => {
    // Skip if we're not on the users route
    if (routerState.location.pathname !== '/admin/users') {
      return
    }

    // Skip if this is an internal update
    if (isInternalUpdate.current) return

    const search = routerState.location.search as unknown as Partial<UrlParams>
    const urlParamsFromUrl: UrlParams = {
      q: search.q,
      pageIndex: search.pageIndex,
      pageSize: search.pageSize,
      sortBy: search.sortBy,
      sortDesc: search.sortDesc,
    }

    // Use functional update to avoid dependency on urlParams
    setUrlParams((prevUrlParams) => {
      const hasChanged =
        prevUrlParams.q !== urlParamsFromUrl.q ||
        prevUrlParams.pageIndex !== urlParamsFromUrl.pageIndex ||
        prevUrlParams.pageSize !== urlParamsFromUrl.pageSize ||
        prevUrlParams.sortBy !== urlParamsFromUrl.sortBy ||
        prevUrlParams.sortDesc !== urlParamsFromUrl.sortDesc

      if (hasChanged) {
        // Update pagination if changed
        if (
          prevUrlParams.pageIndex !== urlParamsFromUrl.pageIndex ||
          prevUrlParams.pageSize !== urlParamsFromUrl.pageSize
        ) {
          setPagination({
            pageIndex: urlParamsFromUrl.pageIndex ?? 0,
            pageSize: urlParamsFromUrl.pageSize ?? 3,
          })
        }

        // Update sorting if changed
        if (
          prevUrlParams.sortBy !== urlParamsFromUrl.sortBy ||
          prevUrlParams.sortDesc !== urlParamsFromUrl.sortDesc
        ) {
          if (urlParamsFromUrl.sortBy) {
            setSorting([
              {
                id: urlParamsFromUrl.sortBy,
                desc: urlParamsFromUrl.sortDesc ?? false,
              },
            ])
          } else {
            setSorting([])
          }
        }

        return urlParamsFromUrl
      }

      return prevUrlParams
    })
  })

  // Sync URL params to URL when state changes
  useEffect(() => {
    // Skip sync on initial mount - URL is already correct from initialization
    if (isInitialMount.current) {
      return
    }

    syncStateToUrl(urlParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams, routerState.location.pathname])

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }, [queryClient])

  // Clear search params when navigating to a different route
  useEffect(() => {
    const newPathname = routerState.location.pathname

    // If pathname changed and we're no longer on users route, clear search params
    if (
      currentPathname.current !== newPathname &&
      newPathname !== '/admin/users'
    ) {
      // Reset state to default when leaving the route
      setUrlParams({})
      setPagination({ pageIndex: 0, pageSize: 3 })
      setSorting([])
    }

    currentPathname.current = newPathname
  }, [routerState.location.pathname])

  // Sync URL to state when URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    // Skip sync on initial mount - state is already initialized from URL
    if (isInitialMount.current) {
      return
    }

    syncUrlToState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerState.location.searchStr, routerState.location.pathname])

  return {
    users: tableData,
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
    rowCount,
    handleRefresh,
  }
}
