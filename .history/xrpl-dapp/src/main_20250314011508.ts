import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ensure App.tsx exists

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  React.createElement(React.StrictMode, {}, React.createElement(App))
);
