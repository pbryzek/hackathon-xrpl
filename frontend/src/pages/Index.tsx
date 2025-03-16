import React, { useState, useEffect, useCallback } from "react";
import BondTradePanel from "@/components/BondTradePanel";
import ActiveBondsList from "@/components/ActiveBondsList";
import BondDetailPanel from "@/components/BondDetailPanel";
import { mockBonds, Bond } from "@/lib/bonds";
import { getOpenBonds } from "@/services/bondService";
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
      console.log("Fetching open bonds from API...");
      const openBonds = await getOpenBonds();
      
      console.log("Received open bonds data:", openBonds);
      
      // Check if we got a valid response
      if (openBonds && Array.isArray(openBonds)) {
        // Set bonds regardless of whether the array is empty or not
        setBonds(openBonds);
        setLastUpdated(new Date());
        
        // If we had a selected bond, update it with the new data
        if (selectedBond) {
          const updatedBond = openBonds.find(bond => bond.id === selectedBond.id);
          if (updatedBond) {
            setSelectedBond(updatedBond);
          } else {
            // If the selected bond is no longer in the list, deselect it
            setSelectedBond(null);
          }
        }
      } else {
        console.error("API returned invalid data format:", openBonds);
        setError("Failed to load open bonds. The API returned an invalid response format.");
        // Set bonds to empty array instead of using mock data
        setBonds([]);
      }
    } catch (error) {
      console.error("Error loading bonds:", error);
      setError("Failed to load open bonds. Please try again later.");
      
      // Set bonds to empty array instead of using mock data
      setBonds([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedBond]);

  // Initial load - only once when component mounts
  useEffect(() => {
    console.log("Initial load of open bonds");
    loadBonds(false);
  }, []); // Empty dependency array to run only once

  const handleRefresh = () => {
    loadBonds(true);
  };

  const handleSelectBond = (bond: Bond) => {
    console.log("Index component: Bond selected:", bond);
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
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
          <img src="https://assets.weforum.org/organization/image/ZNfR4l-FX0KuRASO1gp_aNmqv4afaFKDbB-D85jEf20.jpg"
            alt="BNP Paribas - World Economic Forum" 
            width="300"></img>
            <br></br>
            <span className="text-gray-600 mt-1 text-sm sm:text-base">France’s premier multinational bank, Leading the Green Bond Revolution 🌍💚</span>
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">BNP Paribas</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">France's premier multinational bank, Leading the Green Bond Revolution 🌍💚</p> */}
          </div>
          <div className="flex items-center space-x-3 self-end sm:self-auto">
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
        
        {/* Tile Cards Section */}
        <div className="flex flex-row w-full gap-6 mb-2">
          {/* Issuance Card */}
          <div className="glass-card p-6 card-hover-effect border-l-4 border-bond-blue w-1/2 min-h-[180px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Issuance</h3>
              <div className="bg-bond-blue/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-bond-blue animate-pulse-subtle">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold text-bond-blue">$25.6</span>
                <span className="ml-1 text-xl text-gray-600">Billion</span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">Total green bond issuance volume</p>
              <div className="mt-3 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle mr-1.5"></div>
                <span className="text-xs font-medium text-gray-600">12.4% increase from last year</span>
              </div>
            </div>
          </div>
          
          {/* ESG Loans & Bonds Card */}
          <div className="glass-card p-6 card-hover-effect border-l-4 border-green-500 w-1/2 min-h-[180px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">ESG Loans & Bonds</h3>
              <div className="bg-green-500/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 animate-pulse-subtle">
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold text-green-600">$62.5</span>
                <span className="ml-1 text-xl text-gray-600">Billion</span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">Total ESG financing portfolio</p>
              <div className="mt-3 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle mr-1.5"></div>
                <span className="text-xs font-medium text-gray-600">Market leader in sustainable finance</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Active Bonds Table - Top Section */}
        <div className={isMobile ? "h-[400px]" : "h-[350px]"}>
          <div className="glass-card h-full p-6">
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
