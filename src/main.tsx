import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { EnhancedWebSearchService } from './services/enhancedWebSearch'

// Initialize search service
EnhancedWebSearchService.initialize();

// Hide the splash screen once React is ready
const hideLoader = () => {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }
};

// Safety timeout to hide loader even if initialization fails
const safetyTimeout = setTimeout(() => {
  console.warn('Safety timeout reached - hiding loader');
  hideLoader();
}, 10000); // 10 seconds max

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Hide loader after a short delay to ensure smooth transition
setTimeout(() => {
  clearTimeout(safetyTimeout);
  hideLoader();
}, 100);