import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Hier hängt React unsere App in das root-Element aus index.html.
// Das ! sagt TypeScript: Dieses Element ist vorhanden. Eine Laufzeitprüfung ist das nicht.
// StrictMode aktiviert zusätzliche Entwicklungsprüfungen; deshalb können dort
// Render, Initialisierer und Effects mehrmals laufen. Kein doppeltes Produktions-Feature. xD
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
