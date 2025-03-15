
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chip } from "@/components/ui/chip";
import { Bond, TradeAction } from "@/lib/bonds";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import TransitionWrapper from "./TransitionWrapper";
import { toast } from "@/components/ui/use-toast";

interface BondTradePanelProps {
  selectedBond: Bond | null;
}

const BondTradePanel = ({ selectedBond }: BondTradePanelProps) => {
  const [action, setAction] = useState<TradeAction>("Buy");
  const [quantity, setQuantity] = useState<number>(1);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    if (selectedBond) {
      setTotalCost(Number((selectedBond.price * quantity).toFixed(2)));
    }
  }, [selectedBond, quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };

  const handleTrade = () => {
    if (!selectedBond) return;
    
    toast({
      title: `${action} Order Submitted`,
      description: `You have successfully ${action.toLowerCase()}ed ${quantity} unit${quantity > 1 ? 's' : ''} of ${selectedBond.name} for $${totalCost.toLocaleString()}`,
      variant: "default",
    });
  };

  if (!selectedBond) {
    return (
      <div className="glass-panel h-full rounded-2xl p-6 flex flex-col justify-center items-center text-center">
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

  return (
    <TransitionWrapper className="h-full">
      <div className="glass-panel h-full rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{action} Bond</h2>
            <Chip 
              variant="outline" 
              className="font-medium"
            >
              {selectedBond.type}
            </Chip>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{selectedBond.name}</p>
        </div>
        
        <Tabs defaultValue="buy" className="mb-6" onValueChange={(value) => setAction(value as TradeAction)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Buy" className="data-[state=active]:bg-bond-blue data-[state=active]:text-white">
              Buy
            </TabsTrigger>
            <TabsTrigger value="Sell" className="data-[state=active]:bg-bond-red data-[state=active]:text-white">
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="price">Price per Bond</Label>
              <span className="text-sm text-bond-blue font-medium">${selectedBond.price}</span>
            </div>
            <div className="relative">
              <Input
                id="price"
                value={`$${selectedBond.price}`}
                disabled
                className="bg-bond-gray-light text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="quantity">Quantity</Label>
              <span className="text-sm text-muted-foreground">Min: {selectedBond.minimumInvestment / selectedBond.price} units</span>
            </div>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="bg-bond-gray-light"
            />
          </div>
          
          <div className="pt-4 border-t border-bond-gray">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Yield Rate</span>
              <span className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-bond-green" />
                {selectedBond.yield}%
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Maturity Date</span>
              <span className="text-sm font-medium">
                {new Date(selectedBond.maturityDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Rating</span>
              <span className="text-sm font-medium">{selectedBond.rating}</span>
            </div>
          </div>
          
          <div className="bg-bond-gray-light rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-semibold">${totalCost.toLocaleString()}</p>
            </div>
            <Button 
              onClick={handleTrade} 
              className={cn(
                "px-6",
                action === "Buy" ? "bg-bond-blue hover:bg-bond-blue-dark" : "bg-bond-red hover:bg-destructive/90" 
              )}
            >
              {action} Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default BondTradePanel;
