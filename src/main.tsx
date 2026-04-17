import { StrictMode, lazy, Suspense, Component, type ReactNode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'

const FloatingChat = lazy(() => import('./FloatingChat'))
const AboutPage = lazy(() => import('./AboutPage'))

class ChatErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? null : this.props.children }
}

const ASCII_ART = `\n ██████╗ ██████╗  █████╗ ██╗   ██╗\n ██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝\n ██████╔╝██████╔╝███████║ ╚████╔╝ \n ██╔═══╝ ██╔══██╗██╔══██║  ╚██╔╝  \n ██║     ██║  ██║██║  ██║   ██║   \n ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   \n`
console.log(`%c${ASCII_ART}`, 'color: #16a34a; font-size: 12px; font-family: monospace;')
console.log('%c Let\'s build something hard with AI → praysomaldo95@gmail.com ', 'background: #16a34a; color: #f0fdf4; font-size: 13px; font-weight: bold; padding: 4px 8px; border-radius: 3px;')

// eslint-disable-next-line react-refresh/only-export-components
function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-8xl font-display font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-display font-semibold text-foreground mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
function GlobalChat() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/ops')) return null
  return (
    <ChatErrorBoundary>
      <Suspense fallback={null}>
        <FloatingChat />
      </Suspense>
    </ChatErrorBoundary>
  )
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <GlobalChat />
      <Analytics />
    </BrowserRouter>
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
