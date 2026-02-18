import React from "react";
import TitleBar from "./TitleBar"; // 🔹 استفاده از کامپوننت عنوان

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
export default function ProfitSummary({ orders, currentPrices }) {
  // Group orders by market
  const ordersByMarket = {};
  orders.forEach((order) => {
    const market = order.market || "Unknown";
    if (!ordersByMarket[market]) ordersByMarket[market] = [];
    ordersByMarket[market].push(order);
  });

  const tableData = Object.entries(ordersByMarket)
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
    <div>
      {/* 🔹 TitleBar استفاده شد */}
      <TitleBar title="Profit Summary" count={tableData.length} />


    </div>
  );
}