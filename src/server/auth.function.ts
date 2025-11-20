import { createServerFn } from '@tanstack/react-start'
import { LoginSchema } from '@/schemas'
import { UserInfo } from '@/db/schemas'
import { useAppSession } from '@/utils/session'
import {
  authenticateUser,
  getUserByEmail,
  getUserById,
} from '@/services/service.user'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    const user = await getUserByEmail(data.email)
    if (!user) {
      return {
        success: false,
        message: 'Akun tidak ditemukan, silahkan periksa kembali email Anda.',
      }
    }

    const isPasswordValid = await authenticateUser(data.email, data.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message:
          'Login gagal, silahkan periksa kembali email dan password Anda.',
      }
    }

    const session = await useAppSession()
    await session.update({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    return {
      success: true,
      message: 'Login berhasil',
      data: user,
    }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  if (session?.data.userId) {
    await session.clear()
    return {
      success: true,
      message: 'Logout berhasil',
    }
  }
  return {
    success: false,
    message: 'User not authenticated',
  }
})

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserInfo | null> => {
    const session = await useAppSession()
    if (!session?.data.userId) {
      return null
    }

    return await getUserById(session.data.userId)
  },
)
