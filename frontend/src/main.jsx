// React, dependencies & packages
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// App 
import { ProviderUI } from './components/ui/provider'
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CityProvider } from './contexts/CityContext.jsx'
import App from './App.jsx'

// Components here


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProviderUI>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <CityProvider>
              <App />
            </CityProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </ProviderUI>
    </BrowserRouter>
  </StrictMode>,
)