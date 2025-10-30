import { useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  Users,
  User,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logoutFn } from '@/server/auth.function'
import { useAuth } from '@/providers/provider.auth'
import { toast } from 'sonner'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isOpen = false }: SidebarProps) {
  const router = useRouter()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = async () => {
    const { success, message } = await logoutFn()
    if (!success) {
      toast.error(message)
      return
    }
    toast.success(message)

    router.update({
      context: {
        ...router.options.context,
        user: null,
      },
    })

    setUser(null)

    await navigate({ to: '/' })
  }

  const menuItems = [
    {
      group: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: FileText, label: 'Report', href: '/report' },
      ],
    },
    {
      group: 'Admin',
      items: [{ icon: Users, label: 'User Management', href: '/admin/users' }],
    },
  ]

  const displayedMenus = ['super_admin', 'admin'].includes(user?.role ?? '')
    ? menuItems
    : menuItems.filter((menu) => menu.group !== 'Admin')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay: 0.05 }}
      className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:h-screen flex flex-col ${className}`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="p-6 border-b border-border"
      >
        <h1 className="text-xl font-bold text-card-foreground">
          Incident Report
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          PT. Pertamina Patra Niaga
        </p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {displayedMenus.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + groupIndex * 0.05 }}
          >
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link to={item.href}>
                    {({ isActive }) => (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.14 + groupIndex * 0.05 + itemIndex * 0.04,
                        }}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-left h-10 px-3 text-card-foreground border-l-2 focus-visible:ring-inset ${
                            isActive
                              ? 'bg-accent text-accent-foreground border-primary'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.label}
                        </Button>
                      </motion.div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </nav>

      {/* User Menu */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="p-4 border-t border-border"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-12 px-3 text-left"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-card-foreground">
                    {user?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {isDark ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </motion.div>
  )
}
