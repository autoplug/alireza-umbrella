import React, { useState, useEffect } from "react";
import {
  processSell,
  removeDuplicates,
  weightedAveragePrice,
} from "../api/utils";

import localOrders from "../assets/nobitex.json";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ProcessSellPanel() {
  const [sellTable, setSellTable] = useState([]);
  const [buyTable, setBuyTable] = useState([]);
  
  useEffect(() => {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    let localData = [];

    if (cached) {
      try {
        localData = JSON.parse(cached);
      } catch (err) {
        console.error("Error parsing localStorage orders:", err);
        localData = [];
      }
    }

    // Combine localStorage + JSON file
    let combinedOrders = [...localData, ...localOrders];

    // Remove duplicates
    combinedOrders = removeDuplicates(combinedOrders);

    // Filter only completed orders
    const doneOrders = combinedOrders.filter((o) => o.status === "Done");

     // Separate buy and sell orders
    const buyOrders = doneOrders.filter((o) => o.type?.toLowerCase() === "buy");
    const sellOrders = doneOrders.filter((o) => o.type?.toLowerCase() === "sell");


    // Process sells using updated processSell function
    const calculateProcessedSells = (sellOrders, buyOrders) => {
      const result = [];
    
      // Sort sells by time ascending
      const sortedSells = [...sellOrders].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    
      for (const sell of sortedSells) {
        // 🔥 this will MODIFY buyOrders directly
        const used = processSell(sell, buyOrders);
    
        if (!used.length) continue;
    
        const avgPrice = weightedAveragePrice(used);
    
        const profit =
          (Number(sell.feePrice) - avgPrice) * Number(sell.amount);
    
        result.push({
          ...sell,                 // keep all original sell fields
          price: avgPrice,         // replace price with weighted average
          amount: profit,          // replace amount with profit
        });
      }
    
      return result;
    };

    setSellTable(calculateProcessedSells);
    setBuyTable(buyOrders);
    
    
    
    
    
    
  }, []);

  return (
    <div>

      {/* Sell Orders Table */}
      <TitleBar title="Process Sell" count={sellTable.length} />
      {sellTable.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={sellTable} sortBy="time" />
      )}

      {/* Remaining Buy Orders Table */}
      <div style={{ marginTop: "30px" }}>
        <TitleBar title="Remain Buy" count={buyTable.length} />
        {buyTable.length === 0 ? (
          <p>No remaining buy orders.</p>
        ) : (
          <TableOrder orders={buyTable} sortBy="price" />
        )}
      </div>

    </div>
  );
}