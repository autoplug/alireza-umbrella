import React, { useState, useEffect } from "react";
import { processSell, removeDuplicates } from "../api/utils";
import localOrders from "../assets/nobitex.json"; // static JSON file
import TableOrder from "./TableOrder"; // import the table component

const ORDERS_CACHE_KEY = "ORDERS_CACHE"; // localStorage key

export default function ProcessSellPanel() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Load cached orders from localStorage
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

    // Remove duplicates using utility function
    combinedOrders = removeDuplicates(combinedOrders);

    // Filter only completed orders
    const doneOrders = combinedOrders.filter((o) => o.status === "Done");

    // Separate sell and buy orders and sort by created_at ascending
    const sellOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "sell")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const buyOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "buy")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Process each sell order
    const allProcessed = sellOrders.flatMap((sellOrder) => {
      const result = processSell(sellOrder, buyOrders);

      // Prepare array for TableOrder: include sell order itself + matched buy usages
      const rows = result.map((r) => ({
        market: sellOrder.market,
        amount: r.used_amount,
        price: r.price,
        type: "buy",
      }));

      // Add the sell order at the end
      rows.push({
        market: sellOrder.market,
        amount: sellOrder.amount,
        price: sellOrder.price,
        type: "sell",
      });

      return rows;
    });

    setTableData(allProcessed);
  }, []);

  return (
    <div>
      <h3>Process Sell</h3>
      {tableData.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={tableData} sortBy="time" />
      )}
    </div>
  );
}