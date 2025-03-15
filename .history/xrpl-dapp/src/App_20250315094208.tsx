import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CrossMarkAuth from "../../frontend/src/pages/CrossMarkAuth"; // Import the authentication component
import BondSelection from "../../frontend/src/pages/BondSelection";

const App: React.FC = () => {
  return (
    <div>
      <h1>XRPL Green Bonds</h1>
      <Router>
      <Routes>
        <Route path="/" element={<CrossMarkAuth />} />
        <Route path="/bonds" element={<BondSelection />} />
      </Routes>
    </Router>
      
    </div>
  );
};

export default App;
