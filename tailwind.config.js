/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridRow: {
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
      },
    },
  },
  plugins: [],
};
