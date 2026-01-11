import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        serif: ['Fraunces', 'serif']
      },
      colors: {
        forest: {
          dark: '#2F4F3E',    // Primair: Donkergroen
          sage: '#8FAE9A',    // Secundair: Saliegroen
        },
        warmwhite: '#F6F5F1', // Achtergrond
        gold: '#B08A57',      // Accent: Goudbruin
      }
    }
  },
  plugins: []
} satisfies Config
