/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Adicionando borda de 3px, pois não é padrão
      borderWidth: {
        '3': '3px', 
      }
    },
  },
  plugins: [],
}