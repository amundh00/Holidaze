/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ["booked"],
  theme: {
    extend: {
      colors: {
        background: "#EDE8E0",
        textGray: "#6E6E6E",
        green: "#023C3E",
        orange: "#FF8358",
        brown: "#826845",
        white: "#FFFFFF",
      },
      fontFamily: {
        heading: ["'DM Serif Display'", "serif"],
        body: ["'Funnel Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
