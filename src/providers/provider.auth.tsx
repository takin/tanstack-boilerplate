import {
  createContext,
  useState,
  useContext,
  useEffectEvent,
  useEffect,
} from 'react'
import { UserInfo } from '@/db/schemas'
import { getCurrentUserFn } from '@/server/auth.function'

type AuthContextType = {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getCurrentUser = useEffectEvent(async () => {
    setIsLoading(true)
    const user = await getCurrentUserFn()
    setUser(user)
    setIsLoading(false)
  })

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
