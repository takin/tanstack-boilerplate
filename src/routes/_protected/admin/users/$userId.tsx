import { createFileRoute } from '@tanstack/react-router'
import { getUserByIdFn } from '@/server/user.function'

export const Route = createFileRoute('/_protected/admin/users/$userId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { userId } = params
    return await getUserByIdFn({
      data: {
        userId,
      },
    })
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()
  return <div>{data?.name}</div>
}
