import React, { useState, useEffect } from "react";
import { processSell, removeDuplicates } from "../api/utils";
import localOrders from "../assets/nobitex.json";
import TableOrder from "./TableOrder";

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

    let combinedOrders = [...localData, ...localOrders];
    combinedOrders = removeDuplicates(combinedOrders);

    const doneOrders = combinedOrders.filter((o) => o.status === "Done");

    const sellOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "sell")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const buyOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "buy")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    sellOrders.forEach((sell) => {
      processSell(sell, buyOrders);
    });

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
      <div
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          marginBottom: "5px",
          marginLeft: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop : "20px",
        }}
      >
        Process Sell
      </div>

      {tableData.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={tableData} sortBy="time" />
      )}
    </div>
  );
}