import React, { useState, useEffect, useCallback } from "react";
import BondTradePanel from "@/components/BondTradePanel";
import ActiveBondsList from "@/components/ActiveBondsList";
import BondDetailPanel from "@/components/BondDetailPanel";
import { mockBonds, Bond } from "@/lib/bonds";
import { fetchActiveBonds } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch bonds from API
  const loadBonds = useCallback(async (showRefreshing = true) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      const activeBonds = await fetchActiveBonds();
      setBonds(activeBonds);
      setLastUpdated(new Date());
      
      // If we had a selected bond, update it with the new data
      if (selectedBond) {
        const updatedBond = activeBonds.find(bond => bond.id === selectedBond.id);
        if (updatedBond) {
          setSelectedBond(updatedBond);
        } else {
          // If the selected bond is no longer in the list, deselect it
          setSelectedBond(null);
        }
      }
    } catch (error) {
      console.error("Error loading bonds:", error);
      // setError("Failed to load bonds. Please try again later.");
      // We're not using mock data as fallback as requested
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedBond]);

  // Initial load
  useEffect(() => {
    loadBonds(false);
  }, [loadBonds]);

  const handleRefresh = () => {
    loadBonds(true);
  };

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
      <header className="max-w-7xl mx-auto mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Bond Trading</h1>
          <div className="flex items-center space-x-3">
            <div className="glass-card-compact">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-bond-green animate-pulse-subtle mr-1.5"></div>
                <span className="text-xs font-medium">Market Open</span>
              </div>
            </div>
            <div className="glass-card-compact">
              <span className="text-xs font-medium">{lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Error message if any */}
        {error && (
          <div className="glass-card text-red-700 px-4 py-3 mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {/* Active Bonds Table - Top Section */}
        <div className={isMobile ? "h-[400px]" : "h-[350px]"}>
          <div className="glass-card h-full">
            <h3 className="text-xl font-semibold mb-4">Active Bonds</h3>
            <ActiveBondsList
              bonds={bonds}
              selectedBondId={selectedBond?.id || null}
              onSelectBond={handleSelectBond}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </div>
        </div>
        
        {/* Detail and Trade Panels - Bottom Section */}
        {selectedBond ? (
          isMobile ? (
            // Mobile layout - stacked
            <div className="space-y-6">
              <div className="h-[400px]">
                <BondTradePanel selectedBond={selectedBond} />
              </div>
              <div className="h-[500px]">
                <BondDetailPanel selectedBond={selectedBond} />
              </div>
            </div>
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
          )
        ) : (
          <div className="glass-card text-center py-8">
            <p className="text-muted-foreground">Select a bond to view details and trade options</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
