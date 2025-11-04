import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/shared/Sidebar'
import { redirect } from '@tanstack/react-router'
import { NotFoundComponent } from '@/components/shared/NotFound'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen">
      {/* Mobile overlay */}
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden p-2 border-b border-border flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-2 font-semibold">Incident Report</div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
