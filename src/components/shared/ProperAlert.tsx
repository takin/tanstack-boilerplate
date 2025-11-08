import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
} from '../ui/alert-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TriangleAlert } from 'lucide-react'

export interface ProperAlertProps {
  title?: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
  open: boolean
  setOpen: (open: boolean) => void
}

export function ProperAlert({
  title,
  description,
  onConfirm,
  onCancel,
  open,
  setOpen,
}: ProperAlertProps) {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
      setOpen(newOpen)
    }
  }

  const handleExitComplete = () => {
    setOpen(false)
  }

  return (
    <AlertDialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AnimatePresence onExitComplete={handleExitComplete}>
          {isOpen && (
            <>
              <AlertDialogOverlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 bg-black/80"
                />
              </AlertDialogOverlay>
              <AlertDialogPrimitive.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
                  )}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <div className="flex items-center gap-2">
                        <TriangleAlert className="w-6 h-6 text-destructive" />
                        {title ?? 'Are you sure?'}
                      </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {description ?? 'This action cannot be undone.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onConfirm}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </motion.div>
              </AlertDialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
