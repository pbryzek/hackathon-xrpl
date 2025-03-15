
import React, { useState, useEffect } from "react";
import BondTradePanel from "@/components/BondTradePanel";
import ActiveBondsList from "@/components/ActiveBondsList";
import BondDetailPanel from "@/components/BondDetailPanel";
import { mockBonds, Bond } from "@/lib/bonds";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setBonds(mockBonds);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectBond = (bond: Bond) => {
    setSelectedBond(bond);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-bond-blue border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading bonds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-bond-gray-light to-white p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bond Trading</h1>
            <p className="text-muted-foreground mt-1">Explore and trade premium bonds with competitive yields</p>
          </div>
          <div className="flex space-x-2">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-bond-gray">
              <p className="text-xs text-muted-foreground">Market Status</p>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-bond-green animate-pulse-subtle mr-1.5"></div>
                <p className="font-medium">Open</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-bond-gray">
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Active Bonds Table - Top Section */}
        <div className={isMobile ? "h-[400px]" : "h-[350px]"}>
          <ActiveBondsList
            bonds={bonds}
            selectedBondId={selectedBond?.id || null}
            onSelectBond={handleSelectBond}
          />
        </div>
        
        {/* Detail and Trade Panels - Bottom Section */}
        {isMobile ? (
          // Mobile layout - stacked
          selectedBond && (
            <div className="space-y-6">
              <div className="h-[400px]">
                <BondTradePanel selectedBond={selectedBond} />
              </div>
              <div className="h-[500px]">
                <BondDetailPanel selectedBond={selectedBond} />
              </div>
            </div>
          )
        ) : (
          // Desktop layout - side by side
          <div className="grid grid-cols-2 gap-6 h-[calc(100vh-20rem)]">
            <div className="h-full">
              <BondTradePanel selectedBond={selectedBond} />
            </div>
            <div className="h-full">
              <BondDetailPanel selectedBond={selectedBond} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
