export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#00FF99", // Neon green
          secondary: "#009DDC", // XRPL blue
          background: "#001F1F", // Deep green-black for contrast
        },
        backdropBlur: {
          glass: "30px", // Stronger glass effect
        },
        boxShadow: {
          glow: "0px 0px 30px rgba(0, 255, 128, 0.5)", // More defined green glow
        },
      },
    },
    plugins: [],
  };
  