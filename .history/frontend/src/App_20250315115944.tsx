import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BondSelection from "./pages/BondSelection";
import CrossMarkAuth from "./pages/CrossMarkAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// ✅ Import the Header Component
import Header from "./components/ui/header";
import "./index.css"; // ✅ Ensure Tailwind is applied
import "./index1.css"; // ✅ Ensure Tailwind is applied


const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<CrossMarkAuth />} />
            <Route path="/bonds" element={<BondSelection />} />
            <Route path="/marketplace" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
