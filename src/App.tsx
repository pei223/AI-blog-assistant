import React from 'react'
import './App.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { ErrorBoundary } from 'react-error-boundary'
import AppErrorFallback from './AppErrorFallback'
import Init from './pages/Init'
import { createTheme, ThemeProvider } from '@mui/material'
import Generate from './pages/Generate'
import Settings from './pages/Settings'

const theme = createTheme()

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Init />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </HashRouter>
  )
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        autoHideDuration={3000}
      >
        <ErrorBoundary FallbackComponent={AppErrorFallback}>
          <AppRouter />
        </ErrorBoundary>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
