import React, { useState, useEffect } from "react";

import {processAllSells, removeDuplicates} from "../api/utils";

import localOrders from "../assets/nobitex.json";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

const keepLastTenPerMarket = (orders) => {
  // Group orders by market
  const grouped = orders.reduce((acc, order) => {
    const key = order.market;
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  const result = [];

  // For each market
  Object.keys(grouped).forEach((market) => {
    const sorted = [...grouped[market]].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    // Keep only last 10
    result.push(...sorted.slice(-5));
  });

  return result;
};




export default function ProcessSellPanel() {
  const [sellTable, setSellTable] = useState([]);
  const [buyTable, setBuyTable] = useState([]);

  useEffect(() => {
    // ===== Load cached + local JSON orders =====
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    let localData = [];

    if (cached) {
      try {
        localData = JSON.parse(cached);
      } catch (err) {
        console.error("Error parsing localStorage orders:", err);
      }
    }

    let combinedOrders = [...localData, ...localOrders];

    // Remove duplicates
    combinedOrders = removeDuplicates(combinedOrders);

    // Only completed orders
    const doneOrders = combinedOrders.filter((o) => o.status === "Done");

    // ===== Group orders by market =====
    const ordersByMarket = doneOrders.reduce((acc, order) => {
      const key = order.market;
      if (!acc[key]) acc[key] = { buys: [], sells: [] };
      if (order.type?.toLowerCase() === "buy") acc[key].buys.push(order);
      if (order.type?.toLowerCase() === "sell") acc[key].sells.push(order);
      return acc;
    }, {});

    let finalSells = [];
    let finalBuys = [];

    // ===== Process each market separately =====
    Object.entries(ordersByMarket).forEach(([market, { buys, sells }]) => {
      const { processedSells, updatedBuys } = processAllSells(sells, buys);

      finalSells.push(...processedSells);
      finalBuys.push(...updatedBuys);
    });


    finalSells = keepLastTenPerMarket(finalSells);
    setSellTable(finalSells);
    
    finalBuys = finalBuys.filter((order) => Number(order.amount) > 0);
    setBuyTable(finalBuys);
    
    
    
  }, []);
  const total = { "": 0, Profit: 1200, "Avg Price": 30, Type: 10}; 
  return (
    <div>
      {/* ===== Sell Orders Table ===== */}
      <TitleBar title="Process Sell" count={sellTable.length} />
      {sellTable.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={sellTable} sortBy="time" total={total}/>
      )}

      {/* ===== Remaining Buy Orders Table ===== */}
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