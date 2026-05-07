import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'  // Change this
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>  {/* Change from BrowserRouter to HashRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>,
)