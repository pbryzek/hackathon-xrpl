import React from "react";  // ✅ Ensure this import exists
import ReactDOM from "react-dom/client";
import App from "./App";  // ✅ Make sure App.tsx is imported correctly

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>  // ✅ Correct usage
    <App />
  </React.StrictMode>
);
