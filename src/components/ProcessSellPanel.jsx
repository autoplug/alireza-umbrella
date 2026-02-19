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
  const [sellData, setSellData] = useState([]);
  const [remainBuyData, setRemainBuyData] = useState([]);

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
    
    // Apply Commision
    doneOrders.forEach(o => {
      o.feePrice = applyFeePrice(o);
    });

    // Sort buy & sell orders
    const sellOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "sell")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const buyOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "buy")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Process each sell and calculate profit
    const sellRows = sellOrders.map((sell) => {
      const used = processSell(sell, buyOrders);

      // Apply weighted average calculation
      const avgBuyPrice = weightedAveragePrice(used);

      // Example profit calculation
      const profit =
        avgBuyPrice != null
          ? (Number(sell.price) - Number(avgBuyPrice)) *
            Number(sell.amount)
          : 0;

      return {
        market: sell.market,
        amount: sell.amount,
        price: sell.price,
        type: "sell",
        created_at: sell.created_at,
        profit: profit,
      };
    });

    setSellData(sellRows);
    
    // Filter remaining buy orders with amount > 0
    const remainingBuys = buyOrders
      //.filter((buy) => Number(buy.amount) > 0)
      //.sort((a, b) => Number(a.price) - Number(b.price)); // مرتب بر اساس قیمت

    setRemainBuyData(remainingBuys)
    
    
    
    
    
    
  }, []);

  return (
    <div>

      {/* Sell Orders Table */}
      <TitleBar title="Process Sell" count={sellData.length} />
      {sellData.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={sellData} sortBy="time" />
      )}

      {/* Remaining Buy Orders Table */}
      <div style={{ marginTop: "30px" }}>
        <TitleBar title="Remain Buy" count={remainBuyData.length} />
        {remainBuyData.length === 0 ? (
          <p>No remaining buy orders.</p>
        ) : (
          <TableOrder orders={remainBuyData} sortBy="price" />
        )}
      </div>

    </div>
  );
}