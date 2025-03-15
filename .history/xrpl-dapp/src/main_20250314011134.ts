import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ Make sure this is correct
import "./style.css"; // ✅ Optional: Import global styles

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
