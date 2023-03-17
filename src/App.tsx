import React from 'react'
import './App.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { ErrorBoundary } from 'react-error-boundary'
import AppErrorFallback from './AppErrorFallback'
import Init from './pages/Init'
import { createTheme, ThemeProvider } from '@mui/material'
import Generate from './pages/generate/Generate'
import Settings from './pages/Settings'
import { indigo, teal } from '@mui/material/colors'
import GenerateLongText from './pages/generate/GenerateLongText'

const theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: indigo[500]
    },
    secondary: {
      main: teal[500]
    }
  }
})

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Init />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/generate-long-text" element={<GenerateLongText />} />
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
