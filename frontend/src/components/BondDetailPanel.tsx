import React, { useEffect } from "react";
import { Bond } from "@/lib/bonds";
import { Chip } from "@/components/ui/chip";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import TransitionWrapper from "./TransitionWrapper";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CalendarIcon, BarChart3, TrendingUp, Info, Award, AlertCircle, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface BondDetailPanelProps {
  selectedBond: Bond | null;
}

// Generate random yield history data for visualization
const generateYieldData = (baseYield: number) => {
  const data = [];
  let current = baseYield - 0.5;
  
  for (let i = 0; i < 12; i++) {
    const change = (Math.random() - 0.5) * 0.4;
    current += change;
    data.push({
      month: `${i + 1}m`,
      yield: Number(current.toFixed(2)),
    });
  }
  
  return data;
};

const BondDetailPanel = ({ selectedBond }: BondDetailPanelProps) => {
  useEffect(() => {
    if (selectedBond) {
      console.log("BondDetailPanel received bond:", selectedBond);
    }
  }, [selectedBond]);

  if (!selectedBond) {
    return (
      <div className="glass-card h-full p-6 flex flex-col justify-center items-center text-center">
        <div className="text-muted-foreground">
          <Info className="w-12 h-12 mb-4 mx-auto opacity-40" />
          <h3 className="text-xl font-medium mb-2">Bond Details</h3>
          <p className="max-w-xs mx-auto">
            Select a bond to view detailed information
          </p>
        </div>
      </div>
    );
  }

  // Use interestRate if available, otherwise fall back to yield or couponRate
  const effectiveYield = selectedBond.interestRate || selectedBond.yield || selectedBond.couponRate || 0;
  const yieldData = generateYieldData(effectiveYield);
  
  // Calculate risk score (1-100)
  const getRiskScore = (risk: string) => {
    switch (risk) {
      case "Low": return 25;
      case "Medium": return 60;
      case "High": return 90;
      default: return 50;
    }
  };
  
  const riskScore = getRiskScore(selectedBond.risk || "Medium");

  return (
    <TransitionWrapper delay={200} className="h-full">
      <div className="glass-card h-full p-6 overflow-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-semibold">Bond Details</h2>
            <Chip 
              variant={selectedBond.status === "Active" ? "success" : "outline"}
              size="sm"
            >
              {selectedBond.status || "Unknown"}
            </Chip>
          </div>
          <p className="text-muted-foreground">{selectedBond.name || "Unnamed Bond"}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium flex items-center mb-3">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Yield History
            </h3>
            <div className="h-[180px] w-full bg-bond-gray-light rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yieldData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[Math.floor(effectiveYield - 1), Math.ceil(effectiveYield + 1)]} 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: "white", 
                      border: "none", 
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="hsl(var(--bond-blue))" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "hsl(var(--bond-blue))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Separator className="bg-bond-gray" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Issuer</p>
              <p className="font-medium">{selectedBond.issuer || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="font-medium">{selectedBond.type || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
              <p className="font-medium">{selectedBond.interestRate || selectedBond.couponRate || "N/A"}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Yield</p>
              <p className="font-medium text-bond-green flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {effectiveYield}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Maturity Date</p>
              <p className="font-medium flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1 text-muted-foreground" />
                {selectedBond.maturityDate ? new Date(selectedBond.maturityDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Min Investment</p>
              <p className="font-medium">${(selectedBond.minimumInvestment || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Investors</p>
              <p className="font-medium">
                {selectedBond.investors && Array.isArray(selectedBond.investors) ? selectedBond.investors.length : 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Stakers</p>
              <p className="font-medium">
                {selectedBond.stakers && Array.isArray(selectedBond.stakers) ? selectedBond.stakers.length : 0}
              </p>
            </div>
            {selectedBond.pfmus_capacity !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">PFMU Capacity</p>
                <p className="font-medium">{selectedBond.pfmus_capacity}</p>
              </div>
            )}
          </div>

          <Separator className="bg-bond-gray" />

          <div>
            <div className="flex items-center mb-2">
              <Award className="w-4 h-4 mr-2 text-bond-blue" />
              <h3 className="text-sm font-medium">Credit Rating: {selectedBond.rating || "Not Rated"}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedBond.rating && selectedBond.rating.includes("A") 
                ? "Investment grade bond with strong capacity to meet financial commitments."
                : "Medium-grade bond with adequate capacity to meet financial commitments."}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Risk Assessment</span>
                </div>
                <span className="text-sm font-medium">
                  {selectedBond.risk || "Medium"} Risk
                </span>
              </div>
              <Progress 
                value={riskScore} 
                className="h-2"
                indicatorClassName={
                  riskScore < 40 ? "bg-bond-green" : 
                  riskScore < 70 ? "bg-amber-500" : 
                  "bg-bond-red"
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                {riskScore < 40 
                  ? "Low risk bonds typically offer more stable but potentially lower returns." 
                  : riskScore < 70 
                  ? "Medium risk bonds offer a balance between stability and return potential."
                  : "Higher risk bonds may offer greater yields but with increased volatility."}
              </p>
            </div>
          </div>

          <Separator className="bg-bond-gray" />

          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {selectedBond.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default BondDetailPanel;
