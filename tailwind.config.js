// tailwind.config.js
import PrimeUI from 'tailwindcss-primeui';

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Include all relevant files
  ],
  plugins: [PrimeUI],
};
