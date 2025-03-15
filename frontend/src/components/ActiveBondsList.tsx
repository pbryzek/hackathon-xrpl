
import React from "react";
import { Bond } from "@/lib/bonds";
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
import { TrendingUp } from "lucide-react";

interface ActiveBondsListProps {
  bonds: Bond[];
  selectedBondId: string | null;
  onSelectBond: (bond: Bond) => void;
}

const ActiveBondsList = ({
  bonds,
  selectedBondId,
  onSelectBond,
}: ActiveBondsListProps) => {
  return (
    <TransitionWrapper delay={100} className="h-full">
      <div className="glass-panel h-full rounded-2xl p-6">
        <div className="mb-4 flex items-center">
          <h2 className="text-2xl font-semibold">Active Bonds</h2>
          <Chip size="sm" className="ml-auto">
            {bonds.length} Available
          </Chip>
        </div>
        
        <div className="overflow-auto h-[calc(100%-3rem)]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Yield</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bonds.map((bond) => (
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
                  <TableCell>{bond.issuer}</TableCell> //time till maturity
                  <TableCell>${bond.price}</TableCell>
                  <TableCell>{bond.term}</TableCell>
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
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default ActiveBondsList;
