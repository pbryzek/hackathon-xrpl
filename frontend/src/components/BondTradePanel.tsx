import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip } from "@/components/ui/chip";
import { Bond, TradeAction } from "@/lib/bonds";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import TransitionWrapper from "./TransitionWrapper";
import { toast } from "@/components/ui/use-toast";
import { investInBond } from "@/services/bondService";

interface BondTradePanelProps {
  selectedBond: Bond | null;
}

const BondTradePanel = ({ selectedBond }: BondTradePanelProps) => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedBond) {
      console.log("BondTradePanel received bond:", selectedBond);
      // Use amount if available, otherwise fall back to price or default to 100
      const bondPrice = selectedBond.amount || selectedBond.price || 100;
      setTotalCost(Number(bondPrice.toFixed(2)));
    }
  }, [selectedBond]);

  const handleTrade = async () => {
    if (!selectedBond) return;
    
    setIsLoading(true);
    
    try {
      // Call the invest API
      const bondId = selectedBond.id?.toString() || "1"; // Default to "1" if id is undefined
      
      // Create a distinctive investor name that won't be confused with bond name or ID
      const investorName = "BNP Paribas Multinational Bank";
      
      console.log("Investing in bond with investor name:", investorName); // Add logging for debugging
      
      const response = await investInBond(bondId, totalCost, investorName);
      
      console.log("Investment response:", response);
      
      toast({
        title: "Buy Order Submitted",
        description: `You have successfully bought 1 unit of ${selectedBond.name} for $${totalCost.toLocaleString()}`,
        variant: "default",
      });
      
      // Refresh the page after successful purchase
      setTimeout(() => {
        window.location.reload();
      }, 500); // Reduced delay from 1500ms to 500ms for faster refresh
    } catch (error) {
      console.error("Error investing in bond:", error);
      
      // Extract error message for the toast
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred";
      
      toast({
        title: "Investment Failed",
        description: `There was an error processing your investment: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedBond) {
    return (
      <div className="glass-card h-full p-6 flex flex-col justify-center items-center text-center">
        <div className="text-muted-foreground">
          <TrendingUp className="w-12 h-12 mb-4 mx-auto opacity-40" />
          <h3 className="text-xl font-medium mb-2">Select a Bond</h3>
          <p className="max-w-xs mx-auto">
            Choose a bond from the list to view trading options
          </p>
        </div>
      </div>
    );
  }

  // Use amount if available, otherwise fall back to price or default to 100
  const bondPrice = selectedBond.amount || selectedBond.price || 100;
  // Use interestRate if available, otherwise fall back to yield or couponRate
  const effectiveYield = selectedBond.interestRate || selectedBond.yield || selectedBond.couponRate || 0;

  return (
    <TransitionWrapper className="h-full">
      <div className="glass-card h-full p-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Buy Bond</h2>
            <Chip 
              variant="outline" 
              className="font-medium"
            >
              {selectedBond.type || "Bond"}
            </Chip>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{selectedBond.name || "Unnamed Bond"}</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="price">Price per Bond</Label>
              <span className="text-sm text-bond-blue font-medium">${bondPrice.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-bond-gray">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Interest Rate</span>
              <span className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-bond-green" />
                {effectiveYield}%
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Maturity Date</span>
              <span className="text-sm font-medium">
                {selectedBond.maturityDate ? new Date(selectedBond.maturityDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : "Not specified"}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Rating</span>
              <span className="text-sm font-medium">{selectedBond.rating || "Not Rated"}</span>
            </div>
          </div>
          
          {selectedBond.status === 'closed' ? (
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-gray-500 mb-2">
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V9m0 0V7m0 2h2m-2 0H9" />
                </svg> */}
                <h3 className="text-lg font-medium">This Bond is Closed</h3>
                <p className="text-sm mt-1">
                  This bond offering has been completed and is no longer available for purchase.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-bond-gray-light rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-semibold">${totalCost.toLocaleString()}</p>
              </div>
              <button 
                onClick={handleTrade} 
                className="buy-tokens-button flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Buy Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default BondTradePanel;
