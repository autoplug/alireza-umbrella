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
    const { processedSells, updatedBuys } = processSell(sellOrders, buyOrders);

    // Map remaining buys to table format
    const buyRows = updatedBuys.map((b) => ({
      market: b.market,
      amount: b.amount,
      price: b.price,
      type: "buy",
      created_at: b.created_at,
    }));

    setSellTable(sellRows);
    setBuyTable(buyRows);
    
    
    
    
    
    
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