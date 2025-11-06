import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { RouterProvider, createRootRoute, createRoute, createRouter, createHashHistory } from '@tanstack/react-router'
import TokenDetail from './pages/TokenDetail'

const rootRoute = createRootRoute()
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: App })
const tokenDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tokens/$id',
  component: TokenDetail,
})
const routeTree = rootRoute.addChildren([indexRoute, tokenDetailRoute])

const router = createRouter({ routeTree, history: createHashHistory() })
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
