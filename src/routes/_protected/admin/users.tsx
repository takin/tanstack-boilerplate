import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <h1>Users</h1>
    </>
  )
}
