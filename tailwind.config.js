/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ✅ SCIENTIFIC RAINBOW COLOR EXTENSIONS (zusätzlich zu DaisyUI)
      colors: {
        // ✅ SYNCHRONIZED Scientific Trust Colors (mit globals.css)
        'trust-value': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Kostenlos - Grün (used in --nature-glow)
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'trust-tech': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Mobile - Blau (used in --trust-glow) ✅ SYNCED
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'trust-security': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // DSGVO - Violett (used in --expertise-glow) ✅ SYNCED
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },

        // Scientific Data Colors (Stats Section)
        'data-primary': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Cyan - Klarheit
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        'data-secondary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Blue - Vertrauen
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'data-tertiary': {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo - Tiefes Wissen
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },

        // Scientific Excellence Colors (Why Section)
        'excellence-research': {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef', // Magenta - Forschung
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        'excellence-comprehensive': {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // Rose - Umfassend
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        'excellence-reliable': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Violet - Zuverlässig
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },

      // ✅ SCIENTIFIC TYPOGRAPHY
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Monaco',
          'Consolas',
          'monospace'
        ],
      },

      // ✅ OPTIMIZED SCIENTIFIC ANIMATIONS
      animation: {
        // ✅ SHINE Animations (used by Why Section)
        'shine': 'shine 1.5s ease-in-out',
        'shine-slow': 'shine 3s ease-in-out',
        
        // ✅ SCIENTIFIC Pulses
        'pulse-scientific': 'pulse-scientific 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-data': 'pulse-data 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // ✅ LIVE Indicators
        'live-pulse': 'live-pulse 2s ease-in-out infinite',
        'live-breathe': 'live-breathe 4s ease-in-out infinite',
        
        // ✅ HOVER Effects
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },

      // ✅ ESSENTIAL KEYFRAMES (Supporting animations)
      keyframes: {
        // ✅ SCIENTIFIC Pulses
        'pulse-scientific': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)'
          },
        },
        'pulse-data': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        },

        // ✅ LIVE Indicators
        'live-pulse': {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'scale(0.95)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.1)'
          },
        },
        'live-breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' }
        },

        // ✅ HOVER Effects
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        glow: {
          '0%': { 'box-shadow': '0 0 5px currentColor' },
          '100%': { 'box-shadow': '0 0 20px currentColor, 0 0 30px currentColor' }
        },
      },

      // ✅ SCIENTIFIC SPACING & SIZING
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ✅ SCIENTIFIC SHADOWS
      boxShadow: {
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow-md': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
        'scientific': '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'data': '0 8px 32px rgba(59, 130, 246, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      },

      // ✅ SCIENTIFIC GRADIENTS
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-scientific': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-data': 'linear-gradient(45deg, var(--tw-gradient-stops))',
        'shine-overlay': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },

      // ✅ SCIENTIFIC BLUR
      backdropBlur: {
        'scientific': '12px',
      },

      // ✅ SCIENTIFIC BORDERS
      borderRadius: {
        'scientific': '0.75rem',
        'data': '1rem',
      },
    },
  },

  // ✅ PLUGINS - DaisyUI + Scientific Utilities
  plugins: [
    // DaisyUI Plugin - MUST BE FIRST
    require('daisyui'),

    // Glassmorphism Plugin
    function({ addUtilities }) {
      const newUtilities = {
        '.glassmorphism': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glassmorphism-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }
      addUtilities(newUtilities)
    },

    // Scientific Utilities Plugin
    function({ addComponents }) {
      const components = {
        '.scientific-card': {
          '@apply bg-base-100/80 dark:bg-base-100/10 backdrop-blur-md border border-base-300/30 dark:border-base-700/30 rounded-scientific shadow-scientific transition-all duration-300': {},
        },
        '.data-card': {
          '@apply bg-base-100/90 dark:bg-base-100/10 backdrop-blur-scientific border border-blue-200/30 dark:border-blue-700/30 rounded-data shadow-data': {},
        },
        '.trust-card-scientific': {
          '@apply scientific-card hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] p-3 text-center group cursor-pointer': {},
        },
      }
      addComponents(components)
    },
  ],

  // ✅ DAISYUI CONFIGURATION
  daisyui: {
    themes: [
      // ✅ SCIENTIFIC LIGHT THEME
      {
        'scientific-light': {
          'primary': '#3b82f6', // Blue ✅ SYNCED with trust-tech.500
          'primary-focus': '#2563eb',
          'primary-content': '#ffffff',
          'secondary': '#06b6d4', // Cyan
          'secondary-focus': '#0891b2',
          'secondary-content': '#ffffff',
          'accent': '#8b5cf6', // Violet
          'accent-focus': '#7c3aed',
          'accent-content': '#ffffff',
          'neutral': '#374151', // Gray
          'neutral-focus': '#1f2937',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff', // White background
          'base-200': '#f9fafb', // Very light gray
          'base-300': '#f3f4f6', // Light gray
          'base-content': '#1f2937', // Dark text
          'info': '#06b6d4', // Cyan
          'success': '#10b981', // Green
          'warning': '#f59e0b', // Amber
          'error': '#ef4444', // Red

          // ✅ SYNCHRONIZED SCIENTIFIC TRUST COLORS
          '--trust-value': '#22c55e', // Green - Kostenlos ✅ SYNCED
          '--trust-tech': '#3b82f6', // Blue - Technology ✅ SYNCED
          '--trust-security': '#a855f7', // Purple - Security ✅ SYNCED

          // ✅ SCIENTIFIC DATA COLORS
          '--data-primary': '#06b6d4', // Cyan
          '--data-secondary': '#3b82f6', // Blue
          '--data-tertiary': '#6366f1', // Indigo

          // ✅ SCIENTIFIC EXCELLENCE COLORS
          '--excellence-research': '#d946ef', // Magenta
          '--excellence-comprehensive': '#f43f5e', // Rose
          '--excellence-reliable': '#8b5cf6', // Violet
        },
      },

      // ✅ SCIENTIFIC DARK THEME
      {
        'scientific-dark': {
          'primary': '#60a5fa', // Light blue
          'primary-focus': '#3b82f6',
          'primary-content': '#1e3a8a',
          'secondary': '#22d3ee', // Light cyan
          'secondary-focus': '#06b6d4',
          'secondary-content': '#164e63',
          'accent': '#a78bfa', // Light violet
          'accent-focus': '#8b5cf6',
          'accent-content': '#4c1d95',
          'neutral': '#374151',
          'neutral-focus': '#4b5563',
          'neutral-content': '#f3f4f6',
          'base-100': '#1f2937', // Dark background
          'base-200': '#374151', // Medium dark
          'base-300': '#4b5563', // Light dark
          'base-content': '#f3f4f6', // Light text
          'info': '#22d3ee',
          'success': '#34d399',
          'warning': '#fbbf24',
          'error': '#f87171',

          // ✅ SYNCHRONIZED SCIENTIFIC TRUST COLORS (Dark Mode)
          '--trust-value': '#4ade80', // Light green ✅ SYNCED
          '--trust-tech': '#60a5fa', // Light blue ✅ SYNCED  
          '--trust-security': '#c084fc', // Light purple ✅ SYNCED

          // ✅ SCIENTIFIC DATA COLORS (Dark Mode)
          '--data-primary': '#67e8f9', // Light cyan
          '--data-secondary': '#93c5fd', // Light blue
          '--data-tertiary': '#a5b4fc', // Light indigo

          // ✅ SCIENTIFIC EXCELLENCE COLORS (Dark Mode)
          '--excellence-research': '#e879f9', // Light magenta
          '--excellence-comprehensive': '#fb7185', // Light rose
          '--excellence-reliable': '#a78bfa', // Light violet
        },
      },

      'light', // Fallback
      'dark'   // Fallback
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
}
