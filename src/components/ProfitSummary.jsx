import React, { useEffect, useState } from "react";
import TitleBar from "./TitleBar";

// Import local JSON (static, build-time)
import localOrders from "../assets/localOrders.json";

// Apply fee to each order
const applyFee = (orders) => {
  return orders.map((order) => {
    const amt = Number(order.amount);
    const price = Number(order.price);
    const fee = Number(order.fee || 0);

    if (order.type.toLowerCase() === "buy") {
      order.feePrice = price * (1 + fee / amt);
    } else if (order.type.toLowerCase() === "sell") {
      const totalPrice = price * amt;
      order.feePrice = price * (1 - fee / totalPrice);
    }

    return order;
  });
};

// Remove duplicates based on unique key
const removeDuplicates = (orders) => {
  const seen = new Set();
  return orders.filter((o) => {
    const key = o.id || o.timestamp || JSON.stringify(o);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function ProfitSummary() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stored orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("ORDERS_CACHE") || "[]");
    const storedMarkets = JSON.parse(localStorage.getItem("MARKETS_CACHE") || "{}");

    // Combine both sources: localStorage + imported JSON
    let combinedOrders = [...storedOrders, ...localOrders];

    // Filter only orders with status "Done"
    combinedOrders = combinedOrders.filter((o) => o.status === "Done");

    // Remove duplicates
    const uniqueOrders = removeDuplicates(combinedOrders);

    // Group orders by market
    const ordersByMarket = {};
    uniqueOrders.forEach((order) => {
      const market = order.market || "Unknown";
      if (!ordersByMarket[market]) ordersByMarket[market] = [];
      ordersByMarket[market].push(order);
    });

    // Compute table data
    const data = Object.entries(ordersByMarket)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([market, marketOrders]) => {
        const ordersWithFee = applyFee(marketOrders);

        let totalBuyValue = 0;
        let totalBuyAmount = 0;
        let totalSellValue = 0;
        let totalSellAmount = 0;

        ordersWithFee.forEach((order) => {
          const amt = Number(order.amount);
          const price = Number(order.feePrice);

          if (order.type.toLowerCase() === "buy") {
            totalBuyValue += amt * price;
            totalBuyAmount += amt;
          } else if (order.type.toLowerCase() === "sell") {
            totalSellValue += amt * price;
            totalSellAmount += amt;
          }
        });

        const remainingAmount = totalBuyAmount - totalSellAmount;
        const currentPrice = Number(storedMarkets[market] || 0);
        const totalSold = totalSellValue + remainingAmount * currentPrice;
        const profit = totalSold - totalBuyValue;

        return {
          market,
          remainingAmount,
          totalBuyValue,
          totalSold,
          profit,
        };
      });

    setTableData(data);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <TitleBar title="Profit Summary" count={tableData.length} />

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Market</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Remaining</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Buy</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Sold</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Profit</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9" }}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.market}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.remainingAmount.toLocaleString()}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {row.totalBuyValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {row.totalSold.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>
                {row.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}