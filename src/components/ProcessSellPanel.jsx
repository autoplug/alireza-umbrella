import React, { useState, useEffect } from "react";
import {
  processAllSells,
  removeDuplicates
} from "../api/utils";

import localOrders from "../assets/nobitex.json";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

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

    const finalSells = [];
    const finalBuys = [];

    // ===== Process each market separately =====
    Object.entries(ordersByMarket).forEach(([market, { buys, sells }]) => {

      // Run processAllSells for this market
      const { processedSells, updatedBuys } = processAllSells(sells, buys);

      // Collect results
      finalSells.push(...processedSells);
      finalBuys.push(...updatedBuys);
    });

    setSellTable(finalSells);
    setBuyTable(finalBuys);
  }, []);

  return (
    <div>
      {/* ===== Sell Orders Table ===== */}
      <TitleBar title="Process Sell" count={sellTable.length} />
      {sellTable.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={sellTable} sortBy="time" profit={true}/>
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