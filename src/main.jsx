import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext.jsx' // <-- IMPORTED HERE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider> {/* <-- WRAPPED AROUND APP */}
      <App />
    </AppProvider>
  </React.StrictMode>,
)