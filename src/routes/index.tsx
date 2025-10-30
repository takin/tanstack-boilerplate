import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginComponent } from '@/components/auth/LoginComponent'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginComponent,
})
