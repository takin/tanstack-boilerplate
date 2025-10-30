import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as RootProvider from './providers/provider.root'
import { AuthProvider } from './providers/provider.auth'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { getCurrentUserFn } from './server/auth.function'

// Create a new router instance
export const getRouter = async () => {
  const rootContext = RootProvider.getContext()
  const user = await getCurrentUserFn()

  const router = createRouter({
    routeTree,
    context: { ...rootContext, user },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <RootProvider.Provider {...rootContext}>
          <AuthProvider>{props.children}</AuthProvider>
        </RootProvider.Provider>
      )
    },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rootContext.queryClient,
  })

  return router
}
