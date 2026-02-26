import React, { useState, useEffect } from "react";

import {processAllSells} from "../api/utils";
import { useTrades } from "../hooks/useTrades";

import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

import { formatPrice, formatAmount } from "../api/utils";

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
  const { trades } = useTrades();
  const [sellTable, setSellTable] = useState([]);
  const [buyTable, setBuyTable] = useState([]);

  useEffect(() => {
    // ===== Group orders by market =====
    const ordersByMarket = trades.reduce((acc, order) => {
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
    
    
    
  }, [trades]);
  
  
  return (
    <div>
      {/* ===== Sell Orders Table ===== */}
      <TitleBar title={"Process Sell "} count={sellTable.length} />
      {sellTable.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={sellTable} summary={true} colTypes = {["price", "price", "type"]}/>
      )}

      {/* ===== Remaining Buy Orders Table ===== */}
      <div style={{ marginTop: "30px" }}>
        <TitleBar title="Remain Buy" count={buyTable.length} />
        {buyTable.length === 0 ? (
          <p>No remaining buy orders.</p>
        ) : (
          <TableOrder orders={buyTable} />
        )}
      </div>
    </div>
  );
}