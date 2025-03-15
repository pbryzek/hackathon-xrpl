import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Ensure Tailwind is being loaded!


const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("🚨 Error: Root container `#root` not found in index.html.");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
