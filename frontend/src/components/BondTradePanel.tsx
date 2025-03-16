import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip } from "@/components/ui/chip";
import { Bond, TradeAction } from "@/lib/bonds";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import TransitionWrapper from "./TransitionWrapper";
import { toast } from "@/components/ui/use-toast";

interface BondTradePanelProps {
  selectedBond: Bond | null;
}

const BondTradePanel = ({ selectedBond }: BondTradePanelProps) => {
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    if (selectedBond) {
      console.log("BondTradePanel received bond:", selectedBond);
      // Use amount if available, otherwise fall back to price or default to 100
      const bondPrice = selectedBond.amount || selectedBond.price || 100;
      setTotalCost(Number(bondPrice.toFixed(2)));
    }
  }, [selectedBond]);

  const handleTrade = () => {
    if (!selectedBond) return;
    
    toast({
      title: "Buy Order Submitted",
      description: `You have successfully bought 1 unit of ${selectedBond.name} for $${totalCost.toLocaleString()}`,
      variant: "default",
    });
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
          
          <div className="bg-bond-gray-light rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-semibold">${totalCost.toLocaleString()}</p>
            </div>
            <button 
              onClick={handleTrade} 
              className="buy-tokens-button flex items-center"
            >
              Buy Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default BondTradePanel;
