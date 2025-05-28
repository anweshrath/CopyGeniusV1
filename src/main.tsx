import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ApiKeyProvider } from './context/ApiKeyContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiKeyProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ApiKeyProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
