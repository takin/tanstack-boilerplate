import { useSession } from '@tanstack/react-start/server'
import { dbSchemaUserRole } from '@/db/schemas/db.schema.user'

export type SessionData = {
  userId?: string
  name?: string
  email?: string
  role?: (typeof dbSchemaUserRole)['enumValues'][number]
}

export const useAppSession = () => {
  const session = useSession<SessionData>({
    name: 'ppn-incident-report-session',
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: 'lax',
    },
  })

  return session
}
