/** @type {import('tailwindcss').Config} */

const theme = {
  primary: "#8CB9BD",
  secondary: "#ECB159",
  accent: "#B67352",
  neutral: "#262626",
  info: "#8CB9BD",
  success: "#BBC3A4",
  warning: "#ECB159",
  error: "#E78895",
};

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  daisyui: {
    themes: [
      {
        light: {
          ...theme,
          "base-100": "#FEFBF6",
        },
      },
      {
        dark: {
          ...theme,
          "base-100": "#4F4A45",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
  theme: {
    extend: {},
  },
};
