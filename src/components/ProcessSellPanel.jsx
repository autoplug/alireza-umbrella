import React, { useState, useEffect } from "react";
import { processSell, removeDuplicates } from "../api/utils";
import localOrders from "../assets/nobitex.json";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ProcessSellPanel() {
  const [tableData, setTableData] = useState([]);

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

    // Remove duplicate orders
    combinedOrders = removeDuplicates(combinedOrders);

    // Filter only completed orders
    const doneOrders = combinedOrders.filter((o) => o.status === "Done");

    // Sort both sell and buy orders by time (ascending)
    const sellOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "sell")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const buyOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "buy")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Process sells
    const allProcessed = sellOrders.flatMap((sellOrder) => {
      const result = processSell(sellOrder, buyOrders);

      const rows = result.map((r) => ({
        market: sellOrder.market,
        amount: r.used_amount,
        price: r.price,
        type: "buy",
        created_at: sellOrder.created_at, // add time
      }));

      // Add the sell order row
      rows.push({
        market: sellOrder.market,
        amount: sellOrder.amount,
        price: sellOrder.price,
        type: "sell",
        created_at: sellOrder.created_at, // add time
      });

      return rows;
    });

    setTableData(allProcessed);
  }, []);

  return (
    <div>
      <TitleBar title="Process Sell" count={tableData.length} />
      {tableData.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={tableData} sortBy="time" />
      )}
    </div>
  );
}