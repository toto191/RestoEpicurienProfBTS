import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import { AuthProvider } from './authContext.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
      <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
 //</StrictMode>,
)



  
