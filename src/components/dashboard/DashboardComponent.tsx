import { useAuth } from '@/providers/provider.auth'
import { motion } from 'framer-motion'

export function DashboardComponent() {
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Dashboard</h1>
      <p>{user?.name}</p>
    </motion.div>
  )
}
