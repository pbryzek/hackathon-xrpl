import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CrossMarkAuth from "./pages/CrossMarkAuth"; // Authentication Page
import BondSelection from "./pages/BondSelection"; // Bond Selection Page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div>
          <h1 className="text-3xl font-bold text-center mt-5">XRPL Green Bonds</h1>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<CrossMarkAuth />} />
            <Route path="/bonds" element={<BondSelection />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
