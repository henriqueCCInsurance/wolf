import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'chart-vendor': ['recharts'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'pdf-vendor': ['jspdf', 'html2canvas'],
          'three-vendor': ['three'],
          'date-vendor': ['date-fns'],
          
          // Large feature chunks
          'celebration': ['react-confetti'],
          'data-processing': ['papaparse'],
          
          // App chunks by feature
          'auth': [
            'src/contexts/AuthContext.tsx',
            'src/services/authService.ts',
            'src/components/auth/LoginScreen.tsx',
            'src/components/auth/ProtectedRoute.tsx'
          ],
          'analytics': [
            'src/components/analytics/EnhancedPostGame.tsx',
            'src/components/analytics/CallMap.tsx'
          ],
          'admin': [
            'src/components/admin/AdminDashboard.tsx'
          ],
          'planning': [
            'src/components/planning/IntegratedCallPlanner.tsx',
            'src/components/planning/CallSequencePlanner.tsx',
            'src/components/planning/ContactImporter.tsx'
          ]
        }
      }
    }
  }
})