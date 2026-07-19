import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GeminiKeyProvider } from './context/GeminiKeyContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GeminiKeyProvider>
      <App />
    </GeminiKeyProvider>
  </React.StrictMode>,
)
