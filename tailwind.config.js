/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0B0D',
          900: '#121417',
          800: '#1C2026',
          700: '#262C34',
        },
        silver: {
          DEFAULT: '#C7CDD3',
          light: '#EDEFF1',
        },
        paper: '#F5F6F7',
        muted: {
          DEFAULT: '#A5ABB3',
          dim: '#747C86',
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#60A5FA',
        },
        brass: {
          DEFAULT: '#C9A86A',
          light: '#E8D5A3',
          dark: '#8A6A1F',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', '"Space Grotesk"', 'Georgia', 'serif'],
        body: ['"Inter"', '"Manrope"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1440px',
      },
      boxShadow: {
        premium: '0 24px 60px -20px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)',
        glow: '0 0 0 1px rgba(201,168,106,0.25), 0 12px 40px -12px rgba(201,168,106,0.35)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        shine: { '0%': { transform: 'translateX(-120%) skewX(-18deg)' }, '100%': { transform: 'translateX(220%) skewX(-18deg)' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        shine: 'shine 2.8s ease-in-out infinite',
        floaty: 'floaty 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
