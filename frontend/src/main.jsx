// React, dependencies & packages
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// App 
import { Provider } from './components/ui/provider'
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CityProvider } from './contexts/CityContext.jsx'
import App from './App.jsx'

// Components here


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <CityProvider>
            <App />
          </CityProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)