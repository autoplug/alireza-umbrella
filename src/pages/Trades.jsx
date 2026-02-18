import React from "react";
import ProfitSummary from "../components/ProfitSummary"; // if you prefer a Markets component
import DebugPanel from "../components/ProfitSummary";

export default function MarketPage() {
  return (
    <div>
      <DebugPanel />
      {/* ProfitSummary section */}
      <ProfitSummary />
  
    </div>
  );
}