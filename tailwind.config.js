/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        luxury: {
          bg:        '#0a0a2a',
          obsidian:  '#0a0a2a',
          surface:   '#16213e',
          elevated:  '#1a2744',
          sidebar:   '#0f0f2a',
          border:    'rgba(255, 215, 0, 0.1)',
          gold:      '#ffd700',
          goldLight: '#ffed60',
          goldDark:  '#ffaa00',
          hover:     'rgba(255, 215, 0, 0.12)',
          green:     '#00ff88',
          red:       '#ff4444',
          cyan:      '#00F0FF',
          neon:      'rgba(0, 240, 255, 0.3)',
        }
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(255,215,0,0.05)',
        'glow':  '0 0 30px rgba(255,215,0,0.15), 0 8px 32px rgba(0,0,0,0.5)',
        'gold':  '0 4px 20px rgba(255,215,0,0.4)',
        'neon':  '0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.2)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0a0a2a 0%, #0d1333 50%, #0a0a2a 100%)',
        'gold-gradient':   'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
        'neon-gradient':   'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, transparent 100%)',
      },
      animation: {
        'grid-flow': 'grid-flow 20s linear infinite',
      },
      keyframes: {
        'grid-flow': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(50px)' },
        }
      }
    },
  },
  plugins: [],
}
