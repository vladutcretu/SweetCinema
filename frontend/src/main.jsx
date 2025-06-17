import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { CityProvider } from './contexts/CityContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CityProvider>
      <App />
    </CityProvider>
  </StrictMode>,
)
