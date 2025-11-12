import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'

import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProperAlert } from '@/components/shared/ProperAlert'
import { useUsers } from './-hooks/useUsers'
import { ProperTable } from '@/components/shared/ProperTable'
import { z } from 'zod'

export const Route = createFileRoute('/_protected/admin/users/')({
  component: UsersIndex,
  validateSearch: z.object({
    q: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    sortBy: z.string().optional(),
    sortDesc: z.boolean().optional(),
  }),
})

function UsersIndex() {
  const { user: currentUser } = Route.useRouteContext()

  const {
    selectedUserToDelete,
    setSelectedUserToDelete,
    handleDelete,
    handleSearch,
    searchValue,
    handleRefresh,
    table,
    isLoading,
    isError,
    error,
  } = useUsers(currentUser!)

  const header = useMemo(() => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage users</p>
        </div>
        <Button variant="default" size="sm">
          <PlusIcon className="w-4 h-4" />
          Add User
        </Button>
      </div>
    )
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {header}
        <Card className="mt-6 pt-4">
          <CardContent>
            <div className="mt-4">
              <ProperTable
                table={table}
                isLoading={isLoading}
                isError={isError}
                error={error}
                searchValue={searchValue}
                onSearchChange={handleSearch}
                onRefresh={handleRefresh}
              />
            </div>
          </CardContent>
        </Card>
        <AnimatePresence mode="wait">
          {selectedUserToDelete && (
            <ProperAlert
              key="delete-dialog"
              open={!!selectedUserToDelete}
              setOpen={(open) => {
                setSelectedUserToDelete(open ? selectedUserToDelete : null)
              }}
              onConfirm={handleDelete}
              onCancel={() => {
                // setShowConfirmationDialog(false)
                setSelectedUserToDelete(null)
              }}
              title="Delete User"
              description={`Are you sure you want to delete ${selectedUserToDelete?.name || 'this user'}? This action cannot be undone.`}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
