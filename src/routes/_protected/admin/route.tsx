import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin')({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/' })
    }

    if (!['super_admin', 'admin'].includes(context.user?.role ?? '')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: () => <Outlet />,
})
