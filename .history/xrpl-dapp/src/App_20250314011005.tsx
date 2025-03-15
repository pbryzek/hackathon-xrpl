import React from "react";
import XamanAuth from "./components/XamanAuth"; // Import the authentication component

const App: React.FC = () => {
  return (
    <div>
      <h1>XRPL Staking App</h1>
      <XamanAuth />
    </div>
  );
};

export default App;
