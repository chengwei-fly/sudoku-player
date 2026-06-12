import React from 'react'
import ReactDOM from 'react-dom/client'
import { Index } from './pages/index'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Index />
    </ErrorBoundary>
  </React.StrictMode>,
)
