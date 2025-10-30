import {
  HeadContent,
  createRootRouteWithContext,
  Scripts,
} from '@tanstack/react-router'
import { Toaster } from 'sonner'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { UserInfo } from '@/db/schemas'
import NotFound from '@/components/shared/NotFound'

interface MyRouterContext {
  queryClient: QueryClient
  user: UserInfo | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Incident Report - PT. Pertamina Patra Niaga',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background">
        <div className="flex h-screen">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
