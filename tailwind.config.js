/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enhanced Campbell & Co. primary system with 2025 standards
        primary: {
          25: '#f7fcf1',
          50: '#f0f9e8',
          100: '#daf0c4',
          200: '#c1e694',
          300: '#a5cf4c', // Main Campbell & Co. green
          400: '#8db83a',
          500: '#7aa030',
          600: '#6a8c28',
          700: '#5a7621',
          800: '#4a611b',
          900: '#3d4f17',
          950: '#2a3410',
        },
        // Modern neutral system for better hierarchy
        neutral: {
          0: '#ffffff',
          25: '#fcfcfd',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Enhanced semantic colors for 2025
        semantic: {
          success: {
            25: '#f0fdf4',
            50: '#dcfce7',
            100: '#bbf7d0',
            200: '#86efac',
            300: '#4ade80',
            400: '#22c55e',
            500: '#16a34a',
            600: '#15803d',
            700: '#166534',
            800: '#14532d',
            900: '#052e16',
          },
          warning: {
            25: '#fffcf5',
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#422006',
          },
          error: {
            25: '#fffbfa',
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#450a0a',
          },
          info: {
            25: '#f8faff',
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
        },
        // AI-generated content indicators (2024 trend)
        ai: {
          gradient: {
            from: '#a5cf4c',
            via: '#7dd3fc',
            to: '#c084fc',
          },
          shimmer: '#f0f9ff',
          overlay: 'rgba(165, 207, 76, 0.1)',
        },
        // Enhanced accent colors for modern appeal
        accent: {
          electric: {
            50: '#f0f9ff',
            500: '#06b6d4',
            600: '#0891b2',
          },
          violet: {
            50: '#f5f3ff',
            500: '#8b5cf6',
            600: '#7c3aed',
          },
          rose: {
            50: '#fff1f2',
            500: '#f43f5e',
            600: '#e11d48',
          },
          amber: {
            50: '#fffbeb',
            500: '#f59e0b',
            600: '#d97706',
          },
        },
        // Glass morphism colors
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
          primary: 'rgba(165, 207, 76, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
      },
      // Modern font system with variable font support
      fontFamily: {
        'sans': ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono Variable', 'JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      // Enhanced typography scale for 2025
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.016em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.011em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.017em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.031em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.037em' }],
        '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.047em' }],
        '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.056em' }],
        '7xl': ['4.5rem', { lineHeight: '5rem', letterSpacing: '-0.063em' }],
        '8xl': ['6rem', { lineHeight: '6.5rem', letterSpacing: '-0.072em' }],
        '9xl': ['8rem', { lineHeight: '8.5rem', letterSpacing: '-0.081em' }],
        // Display variants for hero text
        'display-sm': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-md': ['2.875rem', { lineHeight: '3.25rem', letterSpacing: '-0.031em', fontWeight: '600' }],
        'display-lg': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.037em', fontWeight: '600' }],
        'display-xl': ['4.75rem', { lineHeight: '5.25rem', letterSpacing: '-0.047em', fontWeight: '700' }],
      },
      spacing: {
        '0': '0px',
        'px': '1px',
        '0.5': '0.125rem', // 2px
        '1': '0.25rem',    // 4px
        '1.5': '0.375rem', // 6px
        '2': '0.5rem',     // 8px
        '2.5': '0.625rem', // 10px
        '3': '0.75rem',    // 12px
        '3.5': '0.875rem', // 14px
        '4': '1rem',       // 16px
        '5': '1.25rem',    // 20px
        '6': '1.5rem',     // 24px
        '7': '1.75rem',    // 28px
        '8': '2rem',       // 32px
        '9': '2.25rem',    // 36px
        '10': '2.5rem',    // 40px
        '11': '2.75rem',   // 44px
        '12': '3rem',      // 48px
        '14': '3.5rem',    // 56px
        '16': '4rem',      // 64px
        '20': '5rem',      // 80px
        '24': '6rem',      // 96px
        '28': '7rem',      // 112px
        '32': '8rem',      // 128px
        '36': '9rem',      // 144px
        '40': '10rem',     // 160px
        '44': '11rem',     // 176px
        '48': '12rem',     // 192px
        '52': '13rem',     // 208px
        '56': '14rem',     // 224px
        '60': '15rem',     // 240px
        '64': '16rem',     // 256px
        '72': '18rem',     // 288px
        '80': '20rem',     // 320px
        '96': '24rem',     // 384px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      // Enhanced shadow system for spatial design
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        // Spatial design shadows
        'float': '0 8px 30px rgb(0 0 0 / 0.12), 0 2px 4px rgb(0 0 0 / 0.08)',
        'lift': '0 16px 40px rgb(0 0 0 / 0.15), 0 4px 8px rgb(0 0 0 / 0.1)',
        'hover': '0 20px 50px rgb(0 0 0 / 0.2), 0 8px 16px rgb(0 0 0 / 0.12)',
        // Glass morphism shadows
        'glass': '0 8px 32px 0 rgb(31 38 135 / 0.37)',
        'glass-sm': '0 4px 16px 0 rgb(31 38 135 / 0.2)',
        'glass-lg': '0 16px 64px 0 rgb(31 38 135 / 0.4)',
        // Brand glow effects
        'glow': '0 0 20px rgb(165 207 76 / 0.3)',
        'glow-sm': '0 0 10px rgb(165 207 76 / 0.2)',
        'glow-lg': '0 0 40px rgb(165 207 76 / 0.4)',
        'glow-ai': '0 0 30px rgb(125 211 252 / 0.3), 0 0 60px rgb(192 132 252 / 0.2)',
        // Neumorphism for modern touch
        'neu-inset': 'inset 2px 2px 4px rgb(0 0 0 / 0.1), inset -2px -2px 4px rgb(255 255 255 / 0.8)',
        'neu-raised': '2px 2px 4px rgb(0 0 0 / 0.1), -2px -2px 4px rgb(255 255 255 / 0.8)',
        'none': 'none',
      },
      // Enhanced animation system for 2025
      animation: {
        // Basic transitions
        'fade-in': 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-out': 'fade-out 0.2s cubic-bezier(0.4, 0, 1, 1)',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slide-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-out': 'scale-out 0.2s cubic-bezier(0.4, 0, 1, 1)',
        // Modern micro-interactions
        'bounce-gentle': 'bounce-gentle 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        // Loading states
        'spin-smooth': 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        // Advanced effects
        'typewriter': 'typewriter 2s steps(20) forwards',
        'reveal': 'reveal 0.6s cubic-bezier(0.77, 0, 0.175, 1)',
        'morph': 'morph 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        // Glass morphism
        'glass-float': 'glass-float 4s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgb(165 207 76 / 0.3)' },
          '50%': { boxShadow: '0 0 40px rgb(165 207 76 / 0.6), 0 0 60px rgb(165 207 76 / 0.3)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'typewriter': {
          '0%': { width: '0ch' },
          '100%': { width: '20ch' },
        },
        'reveal': {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        'morph': {
          '0%': { borderRadius: '8px' },
          '50%': { borderRadius: '50%' },
          '100%': { borderRadius: '8px' },
        },
        'glass-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotateX(0deg)',
            boxShadow: '0 8px 32px 0 rgb(31 38 135 / 0.37)'
          },
          '50%': { 
            transform: 'translateY(-8px) rotateX(2deg)',
            boxShadow: '0 16px 64px 0 rgb(31 38 135 / 0.5)'
          },
        },
      },
      // Enhanced gradient system for 2025
      backgroundImage: {
        // Basic gradients
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-angular': 'conic-gradient(from 90deg at 50% 50%, var(--tw-gradient-stops))',
        // Glass morphism gradients
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        'glass-gradient-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        'glass-border': 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
        // AI-generated content gradients (2024 trend)
        'ai-gradient': 'linear-gradient(90deg, #a5cf4c, #7dd3fc, #c084fc)',
        'ai-shimmer': 'linear-gradient(90deg, transparent, rgba(165, 207, 76, 0.4), transparent)',
        'ai-border': 'linear-gradient(90deg, #a5cf4c, #7dd3fc)',
        // Brand gradients
        'primary-gradient': 'linear-gradient(135deg, #a5cf4c, #7aa030)',
        'primary-radial': 'radial-gradient(circle at center, #a5cf4c, #6a8c28)',
        'brand-glow': 'radial-gradient(circle at center, rgba(165, 207, 76, 0.3), transparent)',
        // Modern mesh gradients
        'mesh-primary': 'linear-gradient(135deg, #a5cf4c 0%, #7dd3fc 50%, #c084fc 100%)',
        'mesh-secondary': 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #e0e7ff 100%)',
        'mesh-warm': 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fecaca 100%)',
        // Neumorphism backgrounds
        'neu-gradient': 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
        'neu-gradient-dark': 'linear-gradient(145deg, #1e293b, #0f172a)',
      },
      // Enhanced backdrop blur for glass morphism
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      // Modern easing curves
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Spatial design transforms
      transformOrigin: {
        'center-safe': '50% 45%',
        'top-safe': '50% 10%',
        'bottom-safe': '50% 90%',
      },
      // Modern border radius system
      borderRadius: {
        'none': '0',
        'xs': '0.125rem',
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
        'full': '9999px',
        // Modern organic shapes
        'organic': '64% 36% 70% 30% / 63% 66% 34% 37%',
        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      // 2025 aspect ratios for modern layouts
      aspectRatio: {
        'golden': '1.618',
        'card': '4/3',
        'hero': '16/9',
        'portrait': '3/4',
        'square': '1',
        'video': '16/9',
      },
    },
  },
  plugins: [],
}