// src/api/utils.js

// ---------------- APPLY FEE ----------------
export const applyFee = (orders) =>
  orders.map((order) => {
    const amt = Number(order.amount);
    const price = Number(order.price);
    const fee = Number(order.fee || 0);

    if (order.type?.toLowerCase() === "buy") {
      order.feePrice = price * (1 + fee / amt);
    } else if (order.type?.toLowerCase() === "sell") {
      const totalPrice = price * amt;
      order.feePrice = price * (1 - fee / totalPrice);
    }

    return order;
  });

// ---------------- PROCESS SELL ----------------
export const processSell = (sellOrder, buyOrders) => {
  let sellAmount = Number(sellOrder.amount);

  // Filter buy orders before this sell with remaining amount
  const relevantBuys = buyOrders.filter(
    (b) =>
      new Date(b.created_at) < new Date(sellOrder.created_at) &&
      Number(b.amount) > 0
  );

  if (relevantBuys.length === 0) return [];

  let amount95 = sellAmount * 0.9; // 95% from lowest price buys
  let amount5 = sellAmount * 0.1;  // 5% from highest price buys

  const used = [];

  // ===== 95% from lowest price buys =====
  const lowestBuys = [...relevantBuys].sort((a, b) => a.price - b.price);
  for (const buy of lowestBuys) {
    if (amount95 <= 0) break;
    const take = Math.min(amount95, buy.amount);
    used.push({
      price: buy.feePrice,
      used_amount: take,
    });
    buy.amount -= take;
    amount95 -= take;
  }

  // ===== 5% from highest price buys =====
  const highestBuys = [...relevantBuys].sort((a, b) => b.price - a.price);
  for (const buy of highestBuys) {
    if (amount5 <= 0) break;
    const take = Math.min(amount5, buy.amount);
    used.push({
      price: buy.feePrice,
      used_amount: take,
    });
    buy.amount -= take;
    amount5 -= take;
  }

  return used;
};

// ---------------- WEIGHTED AVERAGE PRICE ----------------
export const weightedAveragePrice = (used) => {
  let totalValue = 0;
  let totalAmount = 0;

  for (const item of used) {
    totalValue += Number(item.price) * Number(item.used_amount);
    totalAmount += Number(item.used_amount);
  }

  if (totalAmount === 0) return 0;

  return totalValue / totalAmount;
};

// ---------------- PREPARE ORDERS FILTERED ----------------
export const prepareOrdersFiltered = (orders, market = null) => {
  const buyOrders = [];
  const sellOrders = [];

  for (const order of orders) {
    // Filter by market if provided
    if (market && order.market !== market) continue;

    // Convert numeric fields
    order.amount = Number(order.amount);
    order.price = Number(order.price);

    // Separate orders by type
    if (order.type === "buy") {
      buyOrders.push(order);
    } else if (order.type === "sell") {
      sellOrders.push(order);
    }
  }

  // Sort by created_at ascending
  buyOrders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  sellOrders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return { buyOrders, sellOrders };
};

// ---------------- REMOVE DUPLICATE ----------------
export const removeDuplicates = (orders) => {
  const seen = new Set();
  return orders.filter((o) => {
    const key = o.id || o.timestamp || JSON.stringify(o);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

