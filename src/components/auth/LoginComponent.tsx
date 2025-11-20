import { useAppForm } from '@/hooks/form.hook'
import { LoginSchema } from '@/schemas/schema.auth'
import { loginFn } from '@/server/auth.function'
import { toast } from 'sonner'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useAuth } from '@/providers/provider.auth'

export function LoginComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const { setUser } = useAuth()

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

      setUser(data ?? null)

      await navigate({
        to: '/dashboard',
      })
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-md w-full space-y-8"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <Card className="w-full">
              <CardHeader className="space-y-1">
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.22 }}
                  className="text-2xl font-bold text-center"
                >
                  Sign in to your account
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.28 }}
                  className="text-center text-muted-foreground"
                >
                  Enter your email and password to access your account
                </motion.p>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.34 }}
                  className="space-y-2"
                >
                  <form.AppField name="email" asyncDebounceMs={500}>
                    {(field) => (
                      <field.ProperTextField
                        id={field.name}
                        autoComplete='on'
                        label="Email"
                        placeholder="Enter your email"
                      />
                    )}
                  </form.AppField>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.4 }}
                  className="space-y-2"
                >
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.46 }}
                  className="space-y-2"
                >
                  <form.AppForm>
                    <form.ProperSubmitButton
                      label="Sign in"
                      className="w-full"
                    />
                  </form.AppForm>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.52 }}
                  className="flex items-center justify-between"
                >
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}
