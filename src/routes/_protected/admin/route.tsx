import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin')({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/' })
    }

    if (!['super_admin', 'admin'].includes(context.user?.role ?? '')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <h1>Admin</h1>
    </>
  )
}
