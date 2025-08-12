/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ✅ Custom Color Palette für TAILR.WIKI
      colors: {
        // Brand Colors
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Additional accent colors für Species-Kategorien
        accent: {
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          lime: '#65a30d',
        }
      },
      
      // ✅ Typography Scale für moderne Layouts
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
      },
      
      // ✅ Enhanced Background Images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/hero-pattern.svg')",
        'species-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
      
      // ✅ Animation & Transitions
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      
      // ✅ Spacing für moderne Layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // ✅ Container Queries Support
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      // ✅ Box Shadow für Cards - Dark Mode optimiert
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.2)',
        // Dark mode shadows
        'soft-dark': '0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)',
        'medium-dark': '0 4px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        'strong-dark': '0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 20px 50px -10px rgba(0, 0, 0, 0.4)',
      },
      
      // ✅ Border Radius für moderne Cards
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // ✅ Line Clamp für Text-Truncation
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      },
      
      // ✅ Backdrop Blur
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  
  // ✅ Plugins
  plugins: [
    require('daisyui'),
  ],
  
  // ✅ daisyUI Konfiguration - Optimiert für TAILR.WIKI
  daisyui: {
    themes: [
      {
        // Light Theme - Custom für TAILR.WIKI
        light: {
          "primary": "#0ea5e9",           // Sky Blue
          "primary-content": "#ffffff",
          "secondary": "#f59e0b",         // Amber
          "secondary-content": "#ffffff",
          "accent": "#10b981",            // Emerald
          "accent-content": "#ffffff",
          "neutral": "#374151",           // Gray 700
          "neutral-content": "#f9fafb",   // Gray 50
          "base-100": "#ffffff",          // White
          "base-200": "#f9fafb",          // Gray 50
          "base-300": "#f3f4f6",          // Gray 100
          "base-content": "#1f2937",      // Gray 800
          "info": "#3b82f6",              // Blue 500
          "info-content": "#ffffff",
          "success": "#10b981",           // Emerald 500
          "success-content": "#ffffff",
          "warning": "#f59e0b",           // Amber 500
          "warning-content": "#ffffff",
          "error": "#ef4444",             // Red 500
          "error-content": "#ffffff",
        },
        // Dark Theme - Custom für TAILR.WIKI
        dark: {
          "primary": "#38bdf8",           // Sky 400
          "primary-content": "#0f172a",   // Slate 900
          "secondary": "#fbbf24",         // Amber 400
          "secondary-content": "#0f172a",
          "accent": "#34d399",            // Emerald 400
          "accent-content": "#0f172a",
          "neutral": "#1f2937",           // Gray 800
          "neutral-content": "#f9fafb",
          "base-100": "#0f172a",          // Slate 900
          "base-200": "#1e293b",          // Slate 800
          "base-300": "#334155",          // Slate 700
          "base-content": "#f1f5f9",      // Slate 100
          "info": "#60a5fa",              // Blue 400
          "info-content": "#0f172a",
          "success": "#4ade80",           // Green 400
          "success-content": "#0f172a",
          "warning": "#fbbf24",           // Amber 400
          "warning-content": "#0f172a",
          "error": "#f87171",             // Red 400
          "error-content": "#0f172a",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: false,
  },
  
  // ✅ Purge Optimization für Production
  future: {
    hoverOnlyWhenSupported: true,
  },
  
  // ✅ Safelist für dynamische Classes
  safelist: [
    'animate-pulse',
    'animate-bounce',
    'animate-float',
    // daisyUI badge colors
    'badge-primary',
    'badge-secondary',
    'badge-accent',
    'badge-outline',
    // Button variants
    'btn-primary',
    'btn-secondary',
    'btn-outline',
    'btn-lg',
    'btn-sm',
  ]
}
