import React, { useMemo } from "react";
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

interface ActiveBondsListProps {
  bonds: Bond[];
  selectedBondId: string | null;
  onSelectBond: (bond: Bond) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const ActiveBondsList = ({
  bonds,
  selectedBondId,
  onSelectBond,
  onRefresh,
  isRefreshing = false,
}: ActiveBondsListProps) => {
  // Calculate time to maturity for each bond
  const bondsWithTimeToMaturity = useMemo(() => {
    return bonds.map(bond => ({
      ...bond,
      timeToMaturity: calculateTimeToMaturity(bond.maturityDate)
    }));
  }, [bonds]);

  return (
    <TransitionWrapper delay={100} className="h-full">
      <div className="glass-panel h-full rounded-2xl p-6">
        <div className="mb-4 flex items-center">
          <h2 className="text-2xl font-semibold">Active Bonds</h2>
          <div className="ml-auto flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-full hover:bg-bond-gray-light transition-colors"
                title="Refresh bonds"
              >
                <RefreshCw className={cn(
                  "w-4 h-4 text-bond-gray-dark",
                  isRefreshing && "animate-spin"
                )} />
              </button>
            )}
            <Chip size="sm">
              {bondsWithTimeToMaturity.length} Available
            </Chip>
          </div>
        </div>
        
        <div className="overflow-auto h-[calc(100%-3rem)]">
          {bondsWithTimeToMaturity.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Maturity</TableHead>
                  <TableHead>Yield</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bondsWithTimeToMaturity.map((bond) => (
                  <TableRow 
                    key={bond.id}
                    onClick={() => onSelectBond(bond)}
                    className={cn(
                      "cursor-pointer transition-all bond-hover",
                      selectedBondId === bond.id 
                        ? "bg-bond-blue/10 hover:bg-bond-blue/20" 
                        : "hover:bg-bond-gray-light"
                    )}
                  >
                    <TableCell className="font-medium">{bond.name}</TableCell>
                    <TableCell>{bond.issuer}</TableCell>
                    <TableCell>${bond.price}</TableCell>
                    <TableCell>{bond.term}</TableCell>
                    <TableCell>{bond.timeToMaturity || "N/A"}</TableCell>
                    <TableCell className="text-bond-green flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      {bond.yield}%
                    </TableCell>
                    <TableCell>
                      <Chip
                        variant={
                          bond.risk === "Low"
                            ? "success"
                            : bond.risk === "Medium"
                            ? "warning"
                            : "danger"
                        }
                        size="sm"
                      >
                        {bond.risk}
                      </Chip>
                    </TableCell>
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
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="mt-4 px-4 py-2 bg-bond-blue text-white rounded-lg hover:bg-bond-blue-dark transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={cn(
                    "w-4 h-4",
                    isRefreshing && "animate-spin"
                  )} />
                  Refresh
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default ActiveBondsList;
