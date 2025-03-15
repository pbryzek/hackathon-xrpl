import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CrossMarkAuth from "./components/CrossMarkAuth"; // Import the authentication component
import BondSelection from "./components/BondSelection";

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
