// Styles
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

// React, dependencies & packages
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// App 
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CityProvider } from './contexts/CityContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <CityProvider>
          <App />
        </CityProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
