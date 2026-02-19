import React, { useState, useEffect } from "react";
import { processSell, removeDuplicates } from "../api/utils";
import localOrders from "../assets/nobitex.json";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ProcessSellPanel() {
  const [sellData, setSellData] = useState([]);
  const [remainBuyData, setRemainBuyData] = useState([]);

  useEffect(() => {
    // Load cached orders from localStorage
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    let localData = [];

    if (cached) {
      try {
        localData = JSON.parse(cached);
      } catch {
        localData = [];
      }
    }

    // Combine localStorage orders with static JSON orders
    let combinedOrders = [...localData, ...localOrders];

    // Remove duplicate orders
    combinedOrders = removeDuplicates(combinedOrders);

    // Keep only completed orders
    const doneOrders = combinedOrders.filter(
      (o) => o.status === "Done"
    );

    // Sort sell orders by time (ascending)
    const sellOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "sell")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Sort buy orders by time (ascending) for processing
    const buyOrders = doneOrders
      .filter((o) => o.type?.toLowerCase() === "buy")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Process each sell order and reduce corresponding buy amounts
    sellOrders.forEach((sell) => {
      processSell(sell, buyOrders);
    });

    // Set sell orders for the first table
    setSellData(sellOrders);

    // Filter remaining buy orders with amount > 0
    const remainingBuys = buyOrders
      .filter((buy) => Number(buy.amount) > 0)
      .sort((a, b) => Number(a.price) - Number(b.price)); // Sort by price ascending

    setRemainBuyData(remainingBuys);

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