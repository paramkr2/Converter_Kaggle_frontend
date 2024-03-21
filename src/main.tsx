
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
const rootElement = document.querySelector('[data-js="root"]')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(rootElement)
root.render(
	<BrowserRouter>
	  <StrictMode>
		<App />
	  </StrictMode>
	 </BrowserRouter>
)
