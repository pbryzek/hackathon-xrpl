import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BondSelection from "./pages/BondSelection";
import CrossMarkAuth from "./pages/CrossMarkAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/ui/header"; // ✅ Ensure Header Uses Context
import { WalletProvider } from "./components/WalletContext"; // ✅ Import Wallet Context
import "./index.css";
import "./index1.css";

const App: React.FC = () => {
  return (
    <WalletProvider> {/* ✅ Wrap everything in WalletProvider */}
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
    </WalletProvider>
  );
};

export default App;
