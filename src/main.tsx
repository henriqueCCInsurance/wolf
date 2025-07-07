import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Hide loader after a short delay to ensure smooth transition
setTimeout(hideLoader, 100);