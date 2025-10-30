import { useAppForm } from '@/hooks/form.hook'
import { LoginSchema } from '@/schemas/schema.auth'
import { loginFn } from '@/server/auth.function'
import { toast } from 'sonner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { useNavigate, useRouter } from '@tanstack/react-router'

export function LoginComponent() {
  const router = useRouter()
  const navigate = useNavigate()

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: ({ formApi }) => formApi.parseValuesWithSchema(LoginSchema),
    },
    onSubmit: async ({ value }) => {
      const { success, message, data } = await loginFn({ data: value })
      if (!success) {
        toast.error(message)
        return
      }

      router.update({
        context: {
          ...router.options.context,
          user: data ?? null,
        },
      })

      await navigate({
        to: '/dashboard',
      })
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <form.AppField name="email" asyncDebounceMs={500}>
                  {(field) => (
                    <field.ProperTextField
                      id={field.name}
                      label="Email"
                      placeholder="Enter your email"
                    />
                  )}
                </form.AppField>
              </div>
              <div className="space-y-2">
                <form.AppField name="password">
                  {(field) => (
                    <field.ProperTextField
                      id={field.name}
                      type="password"
                      label="Password"
                      placeholder="Enter your password"
                    />
                  )}
                </form.AppField>
              </div>
              <div className="space-y-2">
                <form.AppForm>
                  <form.ProperSubmitButton label="Sign in" className="w-full" />
                </form.AppForm>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
