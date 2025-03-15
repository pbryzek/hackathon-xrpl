export default { content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], theme: { extend: {} }, plugins: [], };

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#A3E4DB", // Soft mint green
          secondary: "#009DDC", // XRPL blue
          background: "#F4F4F4", // Light background
        },
        backdropBlur: {
          glass: "20px",
        },
        boxShadow: {
          glow: "0px 0px 20px rgba(50, 205, 50, 0.5)", // Soft green glow effect
        },
      },
    },
    plugins: [],
  };
  