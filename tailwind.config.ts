// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      gridTemplateColumns: {
        'gallery': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
    },
  },
  plugins: [],
};

export default config;