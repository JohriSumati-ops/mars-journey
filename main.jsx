import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as THREE from 'three'

// Fix THREE.Clock deprecation warning in r169+
if (!THREE.Clock) {
  THREE.Clock = THREE.Timer
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)