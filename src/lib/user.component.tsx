import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { dbSchemaUserRole, UserInfo } from '@/db/schemas'
import { cn } from './utils'

export function getUserBadgeByRole(
  role: (typeof dbSchemaUserRole)['enumValues'][number],
): React.ReactNode {
  switch (role) {
    case 'super_admin':
      return <Badge variant={'shade-purple'}>Super Admin</Badge>
    case 'admin':
      return <Badge variant={'shade-info'}>Admin</Badge>
    default:
      return <Badge variant={'shade-gray'}>User</Badge>
  }
}

export function getUserAvatar(user: UserInfo): React.ReactNode {
  let className = ''
  switch (user.role) {
    case 'super_admin':
      className = 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
      break
    case 'admin':
      className = 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
      break
  }
  return (
    <Avatar
      className={cn(
        'w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3 border border-border',
        className,
      )}
    >
      <AvatarFallback className={className}>
        {user.name
          ?.split(' ')
          .map((name) => name[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
  )
}
