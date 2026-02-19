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
  const [processedSells, setProcessedSells] = useState([]);
  const [updatedBuys, setUpdatedBuys] = useState([]);
  
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

    // Sort buy & sell orders
    const sellOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "sell")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const buyOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "buy")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));


    // Process sell orders against buys
    const { updatedBuys, processedSells } = processSell(sellOrders, buyOrders);

    // After processing sell orders
    const sellsWithProfit = processedSells.map((s) => {
      const avgPrice = weightedAveragePrice(s.usedBuys); // weighted average price
      const totalProfit = s.usedBuys.reduce(
        (sum, u) => sum + u.used_amount * (s.sellOrder.price - u.price),
        0
      );
    
      return {
        market: s.sellOrder.market,
        amount: totalProfit,       // profit replaces amount
        price: avgPrice,           // weighted avg replaces price
        type: "sell",
        created_at: s.sellOrder.created_at,
        usedBuys: s.usedBuys,
      };
    });

    setProcessedSells(sellsWithProfit);
    setUpdatedBuys(updatedBuys);
    
    
    
    
    
    
  }, []);

  return (
    <div>

      {/* Sell Orders Table */}
      <TitleBar title="Process Sell" count={processedSells.length} />
      {processedSells.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={processedSells} sortBy="time" />
      )}

      {/* Remaining Buy Orders Table */}
      <div style={{ marginTop: "30px" }}>
        <TitleBar title="Remain Buy" count={updatedBuys.length} />
        {updatedBuys.length === 0 ? (
          <p>No remaining buy orders.</p>
        ) : (
          <TableOrder orders={updatedBuys} sortBy="price" />
        )}
      </div>

    </div>
  );
}