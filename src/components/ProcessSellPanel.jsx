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

    // Remove duplicates
    combinedOrders = removeDuplicates(combinedOrders);

    // Filter only completed orders
    const doneOrders = combinedOrders.filter((o) => o.status === "Done");

    // Separate and sort
    const sellOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "sell")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const buyOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "buy")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Still run processSell for each sell (logic preserved)
    sellOrders.forEach((sell) => {
      processSell(sell, buyOrders);
    });

    // Only send sell orders to table
    const sellRows = sellOrders.map((sell) => ({
      market: sell.market,
      amount: sell.amount,
      price: sell.price,
      type: "sell",
      created_at: sell.created_at,
    }));

    setTableData(sellRows);
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