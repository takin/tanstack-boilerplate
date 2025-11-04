import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/users/$userId_/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()

  return <div>Edit user {userId}</div>
}
