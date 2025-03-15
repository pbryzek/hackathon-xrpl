import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ensure App.tsx exists
import "./style.css"; // Keep this if you have a global style file

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
