import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

import { CityProvider } from './contexts/CityContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <CityProvider>
        <App />
      </CityProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
