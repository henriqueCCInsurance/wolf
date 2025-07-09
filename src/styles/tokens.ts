// Design Tokens - Centralized design system configuration
// Following Material Design 3, Apple HIG, and 2025 modern design standards

export const designTokens = {
  // Enhanced Color System for 2025
  colors: {
    // Enhanced Campbell & Co. primary system
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
    // AI-generated content indicators (2024-2025 trend)
    ai: {
      primary: '#a5cf4c',
      secondary: '#7dd3fc',
      accent: '#c084fc',
      gradient: {
        from: '#a5cf4c',
        via: '#7dd3fc',
        to: '#c084fc',
      },
      shimmer: '#f0f9ff',
      overlay: 'rgba(165, 207, 76, 0.1)',
      border: 'rgba(165, 207, 76, 0.3)',
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
    // Enhanced glass morphism system
    glass: {
      white: 'rgba(255, 255, 255, 0.1)',
      dark: 'rgba(0, 0, 0, 0.1)',
      primary: 'rgba(165, 207, 76, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      backdrop: 'rgba(255, 255, 255, 0.05)',
    },
    // Modern surface system
    surface: {
      primary: 'rgba(255, 255, 255, 0.8)',
      secondary: 'rgba(248, 250, 252, 0.8)',
      elevated: 'rgba(255, 255, 255, 0.95)',
      glass: 'rgba(255, 255, 255, 0.1)',
      floating: 'rgba(255, 255, 255, 0.9)',
      dark: {
        primary: 'rgba(31, 41, 55, 0.8)',
        secondary: 'rgba(17, 24, 39, 0.8)',
        elevated: 'rgba(31, 41, 55, 0.95)',
        glass: 'rgba(31, 41, 55, 0.1)',
        floating: 'rgba(31, 41, 55, 0.9)',
      },
    },
  },

  // Enhanced Typography System for 2025
  typography: {
    fontFamily: {
      // Variable font stack with modern features
      sans: [
        ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        { fontFeatureSettings: '"ss01", "ss02", "ss03", "ss04"' }
      ],
      display: [
        ['Cal Sans', 'Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        { fontFeatureSettings: '"ss01", "ss02"' }
      ],
      mono: [
        ['JetBrains Mono Variable', 'JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
        { fontFeatureSettings: '"ss01", "ss02", "zero", "cv03"' }
      ],
      lato: ['Lato', 'sans-serif'], // Keep for brand consistency
    },
    fontSize: {
      // Enhanced scale with optical sizing
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.016em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.011em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.017em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.031em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.037em' }],
      '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.047em' }],
      '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.056em' }],
      '7xl': ['4.5rem', { lineHeight: '5rem', letterSpacing: '-0.063em' }],
      '8xl': ['6rem', { lineHeight: '6.5rem', letterSpacing: '-0.072em' }],
      '9xl': ['8rem', { lineHeight: '8.5rem', letterSpacing: '-0.081em' }],
      // Display variants for hero text (2025 trend)
      'display-sm': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em', fontWeight: '600' }],
      'display-md': ['2.875rem', { lineHeight: '3.25rem', letterSpacing: '-0.031em', fontWeight: '600' }],
      'display-lg': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.037em', fontWeight: '600' }],
      'display-xl': ['4.75rem', { lineHeight: '5.25rem', letterSpacing: '-0.047em', fontWeight: '700' }],
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    letterSpacing: {
      tightest: '-0.05em',
      tighter: '-0.025em',
      tight: '-0.011em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Spacing System (8pt grid)
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
    36: '9rem',      // 144px
    40: '10rem',     // 160px
    44: '11rem',     // 176px
    48: '12rem',     // 192px
    52: '13rem',     // 208px
    56: '14rem',     // 224px
    60: '15rem',     // 240px
    64: '16rem',     // 256px
    72: '18rem',     // 288px
    80: '20rem',     // 320px
    96: '24rem',     // 384px
  },


  // Enhanced Shadow System for Spatial Design
  boxShadow: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    // Spatial design shadows
    float: '0 8px 30px rgb(0 0 0 / 0.12), 0 2px 4px rgb(0 0 0 / 0.08)',
    lift: '0 16px 40px rgb(0 0 0 / 0.15), 0 4px 8px rgb(0 0 0 / 0.1)',
    hover: '0 20px 50px rgb(0 0 0 / 0.2), 0 8px 16px rgb(0 0 0 / 0.12)',
    // Glass morphism shadows
    glass: '0 8px 32px 0 rgb(31 38 135 / 0.37)',
    'glass-sm': '0 4px 16px 0 rgb(31 38 135 / 0.2)',
    'glass-lg': '0 16px 64px 0 rgb(31 38 135 / 0.4)',
    // Brand glow effects
    glow: '0 0 20px rgb(165 207 76 / 0.3)',
    'glow-sm': '0 0 10px rgb(165 207 76 / 0.2)',
    'glow-lg': '0 0 40px rgb(165 207 76 / 0.4)',
    'glow-ai': '0 0 30px rgb(125 211 252 / 0.3), 0 0 60px rgb(192 132 252 / 0.2)',
    // Neumorphism for modern touch
    'neu-inset': 'inset 2px 2px 4px rgb(0 0 0 / 0.1), inset -2px -2px 4px rgb(255 255 255 / 0.8)',
    'neu-raised': '2px 2px 4px rgb(0 0 0 / 0.1), -2px -2px 4px rgb(255 255 255 / 0.8)',
    none: 'none',
  },

  // Enhanced Animation System for 2025
  animation: {
    duration: {
      instant: '50ms',
      fastest: '100ms',
      faster: '150ms',
      fast: '200ms',
      base: '300ms',
      slow: '400ms',
      slower: '500ms',
      slowest: '700ms',
      glacial: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Modern 2025 easing curves
      spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      'spring-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)',
      'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      'ease-in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
      'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    // Animation keyframes for common patterns
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0', transform: 'translateY(8px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'slide-up': {
        '0%': { opacity: '0', transform: 'translateY(100%)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'scale-in': {
        '0%': { opacity: '0', transform: 'scale(0.9)' },
        '100%': { opacity: '1', transform: 'scale(1)' },
      },
      'shimmer': {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
      },
      'pulse-glow': {
        '0%, 100%': { boxShadow: '0 0 20px rgb(165 207 76 / 0.3)' },
        '50%': { boxShadow: '0 0 40px rgb(165 207 76 / 0.6)' },
      },
      'float': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-6px)' },
      },
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Enhanced Gradient System for 2025
  gradients: {
    // Brand gradients
    primary: 'linear-gradient(135deg, #a5cf4c, #7aa030)',
    'primary-radial': 'radial-gradient(circle at center, #a5cf4c, #6a8c28)',
    'brand-glow': 'radial-gradient(circle at center, rgba(165, 207, 76, 0.3), transparent)',
    // AI-generated content gradients (2024-2025 trend)
    ai: 'linear-gradient(90deg, #a5cf4c, #7dd3fc, #c084fc)',
    'ai-shimmer': 'linear-gradient(90deg, transparent, rgba(165, 207, 76, 0.4), transparent)',
    'ai-border': 'linear-gradient(90deg, #a5cf4c, #7dd3fc)',
    // Modern mesh gradients
    'mesh-primary': 'linear-gradient(135deg, #a5cf4c 0%, #7dd3fc 50%, #c084fc 100%)',
    'mesh-secondary': 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #e0e7ff 100%)',
    'mesh-warm': 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fecaca 100%)',
    // Glass morphism gradients
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
    'glass-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
    'glass-border': 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
    // Neumorphism gradients
    'neu-light': 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
    'neu-dark': 'linear-gradient(145deg, #1e293b, #0f172a)',
    // Surface gradients
    surface: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.8))',
    'surface-elevated': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
    // Accent gradients
    accent: {
      electric: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      violet: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      rose: 'linear-gradient(135deg, #f43f5e, #e11d48)',
      amber: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
  },

  // Enhanced Blur System for Glass Morphism
  blur: {
    none: '0',
    xs: '2px',
    sm: '4px',
    DEFAULT: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
    '4xl': '128px',
  },

  // Modern Layout Patterns for 2025
  layout: {
    // Container sizes
    container: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    // Bento grid patterns
    bento: {
      gap: '1rem',
      'gap-sm': '0.5rem',
      'gap-lg': '1.5rem',
      'gap-xl': '2rem',
    },
    // Modern aspect ratios
    aspect: {
      square: '1/1',
      video: '16/9',
      golden: '1.618/1',
      card: '4/3',
      portrait: '3/4',
      hero: '21/9',
    },
  },

  // Component States for Modern UX
  states: {
    // Interactive states
    hover: {
      scale: '1.02',
      lift: '4px',
      'lift-lg': '8px',
      glow: '0 0 20px rgba(165, 207, 76, 0.4)',
    },
    focus: {
      ring: '0 0 0 2px rgba(165, 207, 76, 0.5)',
      'ring-sm': '0 0 0 1px rgba(165, 207, 76, 0.3)',
      'ring-lg': '0 0 0 3px rgba(165, 207, 76, 0.5)',
    },
    active: {
      scale: '0.98',
      press: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },

  // Micro-interaction Patterns
  microInteractions: {
    // Button interactions
    button: {
      hover: {
        transform: 'translateY(-1px)',
        shadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        duration: '150ms',
      },
      press: {
        transform: 'translateY(0)',
        shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        duration: '100ms',
      },
    },
    // Card interactions
    card: {
      hover: {
        transform: 'translateY(-2px)',
        shadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        duration: '200ms',
      },
    },
    // Input interactions
    input: {
      focus: {
        ring: '0 0 0 2px rgba(165, 207, 76, 0.2)',
        border: '#a5cf4c',
        duration: '150ms',
      },
    },
  },

  // Modern Border Radius Patterns
  borderRadius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.75rem',
    '4xl': '2rem',
    full: '9999px',
    // Organic shapes for 2025
    organic: '64% 36% 70% 30% / 63% 66% 34% 37%',
    blob: '60% 40% 30% 70% / 60% 30% 70% 40%',
    // Smooth corners
    smooth: '0.5rem',
    'smooth-lg': '1rem',
    'smooth-xl': '1.5rem',
  },

  // Accessibility Enhancements
  accessibility: {
    // Reduced motion preferences
    reducedMotion: {
      duration: '0.01ms',
      scale: 'none',
      transform: 'none',
    },
    // High contrast support
    highContrast: {
      border: '2px solid',
      outline: '2px solid',
      shadow: 'none',
    },
    // Focus indicators
    focus: {
      ring: '2px solid #a5cf4c',
      offset: '2px',
      radius: '0.25rem',
    },
  },
} as const;

// Type helpers
export type ColorScale = keyof typeof designTokens.colors.primary;
export type SpacingScale = keyof typeof designTokens.spacing;
export type FontSize = keyof typeof designTokens.typography.fontSize;
export type BorderRadius = keyof typeof designTokens.borderRadius;
export type BoxShadow = keyof typeof designTokens.boxShadow;
export type Gradient = keyof typeof designTokens.gradients;

// Utility functions
export const getColor = (color: string, scale?: ColorScale) => {
  const [colorName, colorScale] = color.split('-');
  const colorObj = designTokens.colors[colorName as keyof typeof designTokens.colors];
  if (!colorObj) return undefined;
  
  if (scale) {
    return (colorObj as any)[scale];
  }
  return (colorObj as any)[colorScale as unknown as ColorScale];
};

export const getSpacing = (scale: SpacingScale) => {
  return designTokens.spacing[scale];
};

export const getFontSize = (scale: FontSize) => {
  return designTokens.typography.fontSize[scale];
};

export const getBorderRadius = (scale: BorderRadius) => {
  return designTokens.borderRadius[scale];
};

export const getBoxShadow = (scale: BoxShadow) => {
  return designTokens.boxShadow[scale];
};

export const getGradient = (gradient: Gradient) => {
  return designTokens.gradients[gradient];
};

export default designTokens;