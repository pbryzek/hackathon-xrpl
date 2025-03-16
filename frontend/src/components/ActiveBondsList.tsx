import React, { useMemo, useState, useEffect } from "react";
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
import { TrendingUp, AlertCircle, RefreshCw, Users, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

  // Initial setup - just log that we're using the bonds from the parent
  useEffect(() => {
    console.log("Using bonds provided by parent:", initialBonds.length);
  }, [initialBonds.length]);

  // Update local bonds state when initialBonds changes
  useEffect(() => {
    setBonds(initialBonds);
    setLoading(isRefreshing); // Set loading state based on parent's isRefreshing
  }, [initialBonds, isRefreshing]);

  // Calculate time to maturity for each bond
  const bondsWithTimeToMaturity = useMemo(() => {
    return bonds.map(bond => ({
      ...bond,
      timeToMaturity: calculateTimeToMaturity(bond.maturityDate)
    }));
  }, [bonds]);

  // Handle refresh button click
  const handleRefresh = () => {
    // Only call parent's onRefresh when user explicitly clicks refresh
    if (onRefresh) {
      onRefresh();
    }
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
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Bond Name</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>Interest Rate</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      <span>Maturity Date</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Investor</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      <span>Stakers</span>
                    </div>
                  </TableHead>
                  <TableHead>PFMU Capacity</TableHead>
                  <TableHead>PFMU Staked</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bondsWithTimeToMaturity.map((bond) => (
                  <TableRow 
                    key={bond.id}
                    onClick={() => {
                      // Only allow clicking on open bonds
                      if (bond.status !== 'closed') {
                        console.log("Bond selected:", bond);
                        onSelectBond(bond);
                      }
                    }}
                    className={cn(
                      "transition-all",
                      bond.status === 'closed' 
                        ? "opacity-60 cursor-not-allowed" 
                        : "cursor-pointer bond-hover",
                      selectedBondId === bond.id 
                        ? "bg-bond-blue/10 hover:bg-bond-blue/20" 
                        : "hover:bg-bond-gray-light"
                    )}
                  >
                    <TableCell>
                      {bond.name ? (
                        <div className="font-medium">{bond.name}</div>
                      ) : (
                        <div className="text-muted-foreground text-sm">Unnamed Bond</div>
                      )}

                    </TableCell>
                    <TableCell>
                      {bond.issuer ? (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            {bond.issuer.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{bond.issuer}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unknown Issuer</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {bond.interestRate || bond.couponRate ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">
                            {bond.interestRate ? bond.interestRate : bond.couponRate}%
                          </span>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {bond.maturityDate ? (
                        <div>
                          <div className="font-medium">
                            {new Date(bond.maturityDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(bond.maturityDate), { addSuffix: true })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No date specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {bond.investors && Array.isArray(bond.investors) && bond.investors.length > 0 ? (
                        <div>
                          {bond.investors.slice(0, 3).map((investor, index) => {
                            let investorName = 'Investor';
                            
                            // Handle different investor data structures
                            if (typeof investor === 'string') {
                              // If investor is a string, use it directly
                              investorName = investor;
                            } else if (investor && typeof investor === 'object') {
                              // If investor is an object, try to extract the name
                              if (investor.name && investor.name.startsWith('Investor:')) {
                                // Use our specially formatted investor name but remove the prefix
                                investorName = investor.name.replace('Investor: ', '');
                              } else if (investor.name) {
                                // Use regular name property
                                investorName = investor.name;
                              } else if (investor.bondId) {
                                // If bondId is being used as name, replace with generic investor name
                                investorName = `Investor ${index + 1}`;
                              } else {
                                // Fallback to other properties
                                investorName = investor.id || investor.address || `Investor ${index + 1}`;
                              }
                            }
                            
                            // Remove any remaining "Investor:" prefix if it exists
                            if (typeof investorName === 'string' && investorName.startsWith('Investor:')) {
                              investorName = investorName.replace('Investor:', '').trim();
                            }
                            
                            return (
                              <div key={index} className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {investorName}
                              </div>
                            );
                          })}
                          {bond.investors.length > 3 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              +{bond.investors.length - 3} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">BNP</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {bond.stakers && Array.isArray(bond.stakers) ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{bond.stakers.length}</span>
                          {bond.stakers.length > 0 ? (
                            <Shield className="h-4 w-4 text-green-500" />
                          ) : (
                            <Shield className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">0</span>
                          <Shield className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {bond.pfmus_capacity ? (
                        <span className="font-medium">{Number(bond.pfmus_capacity).toLocaleString()} PFMU</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {bond.pfmus_staked ? (
                        <span className="font-medium">{Number(bond.pfmus_staked).toLocaleString()} PFMU</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {bond.amount ? (
                        <span className="font-medium">${Number(bond.amount).toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {bond.status ? (
                        <Chip 
                          variant={bond.status === 'open' ? 'success' : 'warning'}
                          className="font-medium"
                        >
                          {bond.status === 'open' ? 'Open' : 'Closed'}
                        </Chip>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unknown</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertCircle className="w-12 h-12 text-bond-gray mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Bonds Available</h3>
              <p className="text-muted-foreground max-w-md">
                There are currently no active bonds available for viewing. 
                Active bonds include both open bonds (available for trading) and closed bonds (completed offerings).
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
