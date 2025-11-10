import {
  HeadContent,
  createRootRouteWithContext,
  Scripts,
} from '@tanstack/react-router'
import { Toaster } from 'sonner'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { UserInfo } from '@/db/schemas'
import { NotFoundComponent } from '@/components/shared/NotFound'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface MyRouterContext {
  queryClient: QueryClient
  user: UserInfo | null
  appName: string
  appVersion: string
  appDescription: string
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
        title: 'Propertek - Property Management System',
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
  notFoundComponent: NotFoundComponent,
  errorComponent: NotFoundComponent,
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
        <ReactQueryDevtools />
        <TanStackRouterDevtools />
        <Scripts />
      </body>
    </html>
  )
}
