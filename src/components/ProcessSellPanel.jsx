import React, { useState, useEffect } from "react";
import {
  processAllSells,
  removeDuplicates,
} from "../api/utils";

import localOrders from "../assets/nobitex.json";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ProcessSellPanel() {
  const [sellTable, setSellTable] = useState([]);
  const [buyTable, setBuyTable] = useState([]);

  useEffect(() => {
    // 🔹 Load cached orders
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

    // 🔹 Combine localStorage + JSON file and remove duplicates
    let combinedOrders = removeDuplicates([...localData, ...localOrders]);

    // 🔹 Filter only completed orders
    const doneOrders = combinedOrders.filter((o) => o.status === "Done");

    // 🔹 Separate buy and sell orders (copy to avoid mutation)
    const buyOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "buy")
      .map((o) => ({ ...o }));
    const sellOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "sell")
      .map((o) => ({ ...o }));

    // Deep copy inside processAllSells
    const buys = JSON.parse(JSON.stringify(buyOrders));
    const sells = JSON.parse(JSON.stringify(sellOrders));

    // 🔹 Apply fees and process all sells
    const { processedSells, updatedBuys } = processAllSells(sells, buys);

    setSellTable(processedSells);
    setBuyTable(updatedBuys);
    
    
    
  }, []);

  return (
    <div style={{ width: "100%" }}>
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