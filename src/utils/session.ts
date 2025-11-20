import { useSession } from '@tanstack/react-start/server'
import { dbSchemaUserRole } from '@/db/schemas/db.schema.user'

export type SessionData = {
  userId?: string
  name?: string
  email?: string
  role?: (typeof dbSchemaUserRole)['enumValues'][number]
}

export const useAppSession = () => {

  const appName = import.meta.env.VITE_APP_NAME?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'app'
  const sessionSecret = process.env.SESSION_SECRET!

  const session = useSession<SessionData>({
    name: `${appName}_session`,
    password: sessionSecret,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    },
  })

  return session
}
