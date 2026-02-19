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

/**
 * Process sell orders against buy orders with 90%-10% allocation
 * @param {Array} sellOrders - list of sell orders
 * @param {Array} buyOrders - list of buy orders
 * @returns {Object} { updatedBuys, processedSells }
 */
export const processSell = (sellOrders, buyOrders) => {
  // Apply fee to all orders
  const buys = applyFee([...buyOrders]); // copy to avoid mutation
  const sells = applyFee([...sellOrders]);

  // Sort sell orders by creation time ascending
  const sortedSells = sells.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const processedSells = [];

  for (const sell of sortedSells) {
    let remainingSell = Number(sell.amount);

    // Filter buys that occurred before this sell and still have remaining amount
    const relevantBuys = buys
      .filter((b) => new Date(b.created_at) < new Date(sell.created_at) && b.amount > 0);

    if (relevantBuys.length === 0) {
      processedSells.push({ sellOrder: sell, usedBuys: [], remainingSell });
      continue;
    }

    const usedBuys = [];

    // ===== 90% from lowest price buys =====
    let amount90 = remainingSell * 0.9;
    const lowestBuys = [...relevantBuys].sort((a, b) => a.price - b.price);
    for (const buy of lowestBuys) {
      if (amount90 <= 0) break;
      const take = Math.min(amount90, buy.amount);
      usedBuys.push({ price: buy.feePrice, used_amount: take });
      buy.amount -= take;
      amount90 -= take;
    }

    // ===== 10% from highest price buys =====
    let amount10 = remainingSell * 0.1;
    const highestBuys = [...relevantBuys].sort((a, b) => b.price - a.price);
    for (const buy of highestBuys) {
      if (amount10 <= 0) break;
      const take = Math.min(amount10, buy.amount);
      usedBuys.push({ price: buy.feePrice, used_amount: take });
      buy.amount -= take;
      amount10 -= take;
    }

    // Update remainingSell (optional, could be 0)
    remainingSell = 0;

    // Save processed sell
    processedSells.push({
      sellOrder: sell,
      usedBuys,
      remainingSell,
    });
  }

  return {
    updatedBuys: buys,       // updated buy orders with remaining amounts
    processedSells,          // sell orders with allocation details
  };
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

