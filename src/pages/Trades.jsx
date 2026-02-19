import React from "react";
import ProfitSummary from "../components/ProfitSummary"; // if you prefer a Markets component
//import ProcessSellPanel from "../components/ProcessSellPanel"; 

export default function MarketPage() {
  return (
    <div>
      {/* ProfitSummary section */}
      <ProfitSummary />
      
      {/*<ProcessSellPanel />*/}
  
      <div style={{ height: "60px" }}></div>
    </div>
  );
}