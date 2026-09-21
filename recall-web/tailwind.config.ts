import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#E6007A',
          pinkHover: '#C20067',
          pinkLight: '#FDF2F8',
          pinkBorder: '#FBCFE8',
          blue: '#2563EB',
          indigo: '#3B5BDB',
          purple: '#8B5CF6',
          purpleLight: '#F5F3FF',
        },
        slate: {
          850: '#151F33',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        handwriting: ['Caveat', '"Nanum Pen Script"', '"Comic Sans MS"', 'cursive'],
      },
      boxShadow: {
        card: '0 4px 24px -2px rgba(15, 23, 42, 0.05), 0 2px 8px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        pink: '0 4px 16px rgba(230, 0, 122, 0.28)',
        float: '0 12px 30px rgba(0, 0, 0, 0.08)',
        phone: '0 25px 60px -15px rgba(15, 23, 42, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
