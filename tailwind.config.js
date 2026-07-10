/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#149E70',
        'primary-dark': '#0E7C52',
        'primary-light': '#5FC79E',
        loss: '#EF4444',
        'loss-dark': '#DC2626',
        background: '#0D0C09',
        surface: '#161411',
        'surface-2': '#1E1B15',
        ink: '#F5F3EC',
        muted: '#9B9484',
        divider: '#2A261F',
        deep: '#0B0906',
        paper: '#F4F1E8',
        'paper-ink': '#1B221E',
        'paper-muted': '#6B6F66',
        gold: '#DFAF5F',
        'gold-light': '#F1CE8F',
        'gold-dark': '#B8893D',
        sand: '#F6F1E7',
        'sand-card': '#FCF9F2',
        'ink-warm': '#22261F',
        'muted-warm': '#75705F',
        'line-warm': '#E4DCC8',
        pine: '#0E7C52',
        'pine-dark': '#0A5C3E',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        clash: ['"Clash Display"', 'Impact', 'system-ui', 'sans-serif'],
        gsans: ['"General Sans"', 'system-ui', 'sans-serif'],
        editorial: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '4rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
