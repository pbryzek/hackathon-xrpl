import React from "react";
import XamanAuth from "./components/CrossMarkAuth"; // Import the authentication component

const App: React.FC = () => {
  return (
    <div>
      <h1>XRPL Green Bonds</h1>
      <XamanAuth />
    </div>
  );
};

export default App;
