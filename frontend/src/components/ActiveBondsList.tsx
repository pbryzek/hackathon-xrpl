import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Bond, calculateTimeToMaturity } from "@/lib/bonds";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import TransitionWrapper from "./TransitionWrapper";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { getAllBonds } from "@/services/bondService";

interface ActiveBondsListProps {
  bonds: Bond[];
  selectedBondId: string | null;
  onSelectBond: (bond: Bond) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const ActiveBondsList = ({
  bonds: initialBonds,
  selectedBondId,
  onSelectBond,
  onRefresh,
  isRefreshing = false,
}: ActiveBondsListProps) => {
  const [bonds, setBonds] = useState<Bond[]>(initialBonds);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch bonds from the API
  const fetchBonds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use getAllBonds instead of getActiveBonds
      const allBonds = await getAllBonds();
      console.log("Response from getAllBonds:", allBonds);
      
      // Set bonds directly from the response
      if (allBonds && Array.isArray(allBonds)) {
        setBonds(allBonds);
      } else {
        console.warn("Unexpected response structure from getAllBonds:", allBonds);
        setBonds([]);
      }
      
      // If parent component provided an onRefresh callback, call it
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Error fetching bonds:", err);
      setError("Failed to load bonds. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [onRefresh]);

  // Initial fetch on component mount if no bonds are provided
  useEffect(() => {
    // Only fetch if we have no bonds AND we're not already loading
    if (initialBonds.length === 0 && !loading) {
      console.log("No initial bonds provided, fetching from API...");
      fetchBonds();
    } else {
      console.log("Using bonds provided by parent:", initialBonds.length);
    }
  }, [initialBonds.length, fetchBonds, loading]);

  // Update local bonds state when initialBonds changes, but only if we have bonds
  useEffect(() => {
    if (initialBonds.length > 0) {
      setBonds(initialBonds);
    }
  }, [initialBonds]);

  // Calculate time to maturity for each bond
  const bondsWithTimeToMaturity = useMemo(() => {
    return bonds.map(bond => ({
      ...bond,
      timeToMaturity: calculateTimeToMaturity(bond.maturityDate)
    }));
  }, [bonds]);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchBonds();
  };

  return (
    <TransitionWrapper delay={100} className="h-full">
      {/* <div className="glass-panel h-full rounded-2xl p-6"> */}
        <div className="mb-4 flex items-center">
          <h2 className="text-2xl font-semibold">Active Bonds</h2>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="p-1.5 rounded-full hover:bg-bond-gray-light transition-colors"
              title="Refresh bonds"
            >
              <RefreshCw className={cn(
                "w-4 h-4 text-bond-gray-dark",
                (loading || isRefreshing) && "animate-spin"
              )} />
            </button>
            <Chip size="sm">
              {bondsWithTimeToMaturity.length} Available
            </Chip>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
        
        <div className="overflow-auto h-[calc(100%-3rem)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <RefreshCw className="w-12 h-12 text-bond-blue mb-4 animate-spin" />
              <h3 className="text-lg font-medium mb-2">Loading Bonds</h3>
              <p className="text-muted-foreground max-w-md">
                Please wait while we fetch the latest bond data...
              </p>
            </div>
          ) : bondsWithTimeToMaturity.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Maturity Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bondsWithTimeToMaturity.map((bond) => (
                  <TableRow 
                    key={bond.id}
                    onClick={() => {
                      console.log("Bond selected:", bond);
                      onSelectBond(bond);
                    }}
                    className={cn(
                      "cursor-pointer transition-all bond-hover",
                      selectedBondId === bond.id 
                        ? "bg-bond-blue/10 hover:bg-bond-blue/20" 
                        : "hover:bg-bond-gray-light"
                    )}
                  >
                    <TableCell className="font-medium">{bond.name || 'Unnamed Bond'}</TableCell>
                    <TableCell>{bond.issuer || 'Unknown Issuer'}</TableCell>
                    <TableCell>{bond.interestRate ? `${bond.interestRate}%` : (bond.couponRate ? `${bond.couponRate}%` : 'N/A')}</TableCell>
                    <TableCell>{bond.maturityDate ? new Date(bond.maturityDate).toLocaleDateString() : 'No date specified'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertCircle className="w-12 h-12 text-bond-gray mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Bonds</h3>
              <p className="text-muted-foreground max-w-md">
                There are currently no active bonds available for trading. 
                Please check back later or contact support for more information.
              </p>
              <button
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                className="mt-4 px-4 py-2 bg-bond-blue text-white rounded-lg hover:bg-bond-blue-dark transition-colors flex items-center gap-2"
              >
                <RefreshCw className={cn(
                  "w-4 h-4",
                  (loading || isRefreshing) && "animate-spin"
                )} />
                Refresh
              </button>
            </div>
          )}
        </div>
      {/* </div> */}
    </TransitionWrapper>
  );
};

export default ActiveBondsList;
