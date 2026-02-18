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

  

  return (
    <div>
      {/* 🔹 TitleBar استفاده شد */}
      <TitleBar title="Profit Summary" count={0} />


    </div>
  );
}