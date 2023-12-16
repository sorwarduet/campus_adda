/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        primary: "#FDEEDC",
        secondary: "#FFD8A9",
        white: "#ffffff",
        third: "#F1A661",
        fourth: "#E38B29",
      },
    },
  },
  plugins: [],
};
