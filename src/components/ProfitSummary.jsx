import React from "react";

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

// ProfitSummary component
// Props:
// orders: array of orders with fields {market, type, amount, price, fee}
// currentPrices: { "BTC-RLS": 1450000, "ETH-RLS": 50000, ... }
export default function ProfitSummary({ orders, currentPrices }) {
  // Group orders by market
  const ordersByMarket = {};
  orders.forEach((order) => {
    const market = order.market || "Unknown";
    if (!ordersByMarket[market]) ordersByMarket[market] = [];
    ordersByMarket[market].push(order);
  });

  const tableData = Object.entries(ordersByMarket)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort markets alphabetically
    .map(([market, marketOrders]) => {
      const ordersWithFee = applyFee(marketOrders);

      let totalBuyValue = 0;
      let totalBuyAmount = 0;
      let totalSellValue = 0;
      let totalSellAmount = 0;

      ordersWithFee.forEach((order) => {
        const amt = Number(order.amount);
        const price = Number(order.feePrice); // Use fee-adjusted price

        if (order.type.toLowerCase() === "buy") {
          totalBuyValue += amt * price;
          totalBuyAmount += amt;
        } else if (order.type.toLowerCase() === "sell") {
          totalSellValue += amt * price;
          totalSellAmount += amt;
        }
      });

      const remainingAmount = totalBuyAmount - totalSellAmount;
      const currentPrice = Number(currentPrices[market] || 0);
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

  return (
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
  );
}