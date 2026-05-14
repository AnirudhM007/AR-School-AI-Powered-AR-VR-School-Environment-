import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#060816',
          surface: '#0c1226',
          card: '#12182f',
          purple: '#8c6cff',
          violet: '#7083ff',
          indigo: '#4b66ff',
          accent: '#d8dcff',
          cyan: '#74e6ff',
        },
      },
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(135deg, rgba(140,108,255,0.95) 0%, rgba(75,102,255,0.92) 45%, rgba(116,230,255,0.78) 100%)',
        'gradient-card':
          'linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 45%, rgba(140,108,255,0.08) 100%)',
        'gradient-mesh':
          'radial-gradient(circle at 20% 20%, rgba(140,108,255,0.36), transparent 35%), radial-gradient(circle at 80% 10%, rgba(116,230,255,0.22), transparent 28%), radial-gradient(circle at 50% 80%, rgba(75,102,255,0.18), transparent 40%)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glass: '0 20px 60px rgba(5, 7, 20, 0.42), inset 0 1px 0 rgba(255,255,255,0.18)',
        'glow-purple': '0 0 36px rgba(140,108,255,0.34)',
        'glow-sm': '0 12px 32px rgba(140,108,255,0.22)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-body)', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { boxShadow: '0 10px 30px rgba(140,108,255,0.14)' },
          '50%': { boxShadow: '0 16px 42px rgba(140,108,255,0.28)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
