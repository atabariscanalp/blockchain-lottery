module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      width: {
        93: "93%",
      },
      borderWidth: {
        thin: "0.3px",
      },
    },
    colors: {
      "blue-lightest": "#A8DADC",
      "blue-light": "#457b9d",
      blue: "#1d3557",
      red: "#e63946",
      honeydew: "#f1faee",
      white: "#fdfdfd",
      green: "#32cd32",
      grey: "#d9d9d9",
      "rich-black": "#141d29",
      "blue-fade": "rgba(168,218,220,.1)",
    },
  },
  plugins: [],
};
