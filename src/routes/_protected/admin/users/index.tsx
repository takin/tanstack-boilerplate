import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'

import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProperAlert } from '@/components/shared/ProperAlert'
import { useUsers } from './-hooks/useUsers'
import { buildTableColumns } from './-components/table.columns'
import { ProperTable } from '@/components/shared/ProperTable'

export const Route = createFileRoute('/_protected/admin/users/')({
  component: UsersIndex,
})

function UsersIndex() {
  const { user: currentUser } = Route.useRouteContext()

  const {
    users,
    selectedUser,
    setSelectedUser,
    showConfirmationDialog,
    setShowConfirmationDialog,
    handleDeleteConfirmation,
    handleDelete,
    canBeDeleted,
  } = useUsers(currentUser!)

  const header = useMemo(() => {
    console.log('header is rendered')
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

  const columns = buildTableColumns({
    users,
    onDelete: handleDeleteConfirmation,
    canBeDeleted,
  })

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {header}
        <Card className="mt-6 pt-4">
          <CardContent>
            <ProperTable data={users} columns={columns} showZebraStripe />
          </CardContent>
        </Card>
        <AnimatePresence mode="wait">
          {showConfirmationDialog && (
            <ProperAlert
              key="delete-dialog"
              open={showConfirmationDialog}
              setOpen={(open) => {
                if (!open) setSelectedUser(null)
              }}
              onConfirm={handleDelete}
              onCancel={() => {
                setShowConfirmationDialog(false)
                setSelectedUser(null)
              }}
              title="Delete User"
              description={`Are you sure you want to delete ${selectedUser?.name || 'this user'}? This action cannot be undone.`}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
