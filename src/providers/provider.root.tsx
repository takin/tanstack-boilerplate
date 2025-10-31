import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient()
  const appName = import.meta.env.VITE_APP_NAME
  const appVersion = import.meta.env.VITE_APP_VERSION
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION
  return {
    queryClient,
    appName,
    appVersion,
    appDescription,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
