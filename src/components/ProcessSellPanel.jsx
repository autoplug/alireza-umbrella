import React, { useState, useEffect } from "react";
import {
  processAllSells,
  removeDuplicates,
  applyFee,
} from "../api/utils";

import localOrders from "../assets/nobitex.json";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ProcessSellPanel() {
  const [sellTable, setSellTable] = useState([]);
  const [buyTable, setBuyTable] = useState([]);
  const [originalBuys, setOriginalBuys] = useState([]); // Keep buy amounts persistent

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

    // 🔹 Keep original buys in state
    setOriginalBuys(buyOrders.map((b) => ({ ...b })));

    // 🔹 Apply fees and process all sells
    const { processedSells, updatedBuys } = processAllSells(sellOrders, buyOrders);

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