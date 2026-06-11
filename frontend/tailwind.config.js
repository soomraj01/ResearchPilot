/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#F7F5F2',
          text: '#1F1F1F'
        },
        secondary: {
          text: '#6B7280'
        },
        card: {
          bg: '#FFFFFF'
        },
        accent: {
          brown: '#7A6248'
        },
        border: {
          subtle: '#E8E6E1'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        display: ['Inter Tight', '-apple-system', 'sans-serif'],
        serif: ['Source Serif Pro', 'Georgia', 'serif'],
      },
      boxShadow: {
        'premium': '0 4px 24px -4px rgba(0, 0, 0, 0.5)',
        'premium-hover': '0 8px 32px -4px rgba(0, 0, 0, 0.6)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        '250': '250ms',
      }
    },
  },
  plugins: [],
}
