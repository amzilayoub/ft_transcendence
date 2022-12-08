/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // not final color palette, just for testing
      colors: {
        primary: {
          DEFAULT: "#FD841F",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
        },
        secondary: {
          DEFAULT: "#001253",
        },
        accent: "#ed8936",
      },
    },
  },
  plugins: [],
};
