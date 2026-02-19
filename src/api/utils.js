

// ---------------- APPLY FEE ----------------
export const applyFee = (orders) => {
  for (const order of orders) {
    const amt = Number(order.amount);
    const price = Number(order.price);
    const fee = Number(order.fee || 0);

    if (order.type?.toLowerCase() === "buy") {
      order.feePrice = price * (1 + fee / amt);
    } else if (order.type?.toLowerCase() === "sell") {
      const totalPrice = price * amt;
      order.feePrice = price * (1 - fee / totalPrice);
    }
  }
}; 
  
// ---------------- PROCESS SELL ----------------
export const processSellSingle = (sell, buyOrders) => {
  const sellAmount = Number(sell.amount);

  const relevantBuys = buyOrders.filter(
    (b) =>
      new Date(b.created_at) < new Date(sell.created_at) &&
      b.amount > 0
  );

  if (!relevantBuys.length) return [];

  let amount90 = sellAmount * 0.9;
  let amount10 = sellAmount * 0.1;

  const used = [];

  // 90% from lowest price
  const lowest = [...relevantBuys].sort(
    (a, b) => a.feePrice - b.feePrice
  );

  for (const buy of lowest) {
    if (amount90 <= 0) break;

    const take = Math.min(amount90, buy.amount);

    used.push({
      price: buy.feePrice,
      used_amount: take,
    });

    buy.amount -= take; // 🔥 mutate original array
    amount90 -= take;
  }

  // 10% from highest price
  const highest = [...relevantBuys].sort(
    (a, b) => b.feePrice - a.feePrice
  );

  for (const buy of highest) {
    if (amount10 <= 0) break;

    const take = Math.min(amount10, buy.amount);

    used.push({
      price: buy.feePrice,
      used_amount: take,
    });

    buy.amount -= take;
    amount10 -= take;
  }

  return used;
};



// ---------------- WEIGHTED AVERAGE PRICE ----------------
export const weightedAveragePrice = (usedBuys) => {
  let totalAmount = 0;
  let totalCost = 0;

  for (const u of usedBuys) {
    totalAmount += Number(u.used_amount);
    totalCost += Number(u.price) * Number(u.used_amount);
  }

  return totalAmount === 0 ? 0 : totalCost / totalAmount;
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






export const processAllSells = (sellOrders, buyOrders) => {
  // 🔥 Apply fee once
  applyFee(buyOrders);
  applyFee(sellOrders);

  const result = [];

  const sortedSells = [...sellOrders].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  for (const sell of sortedSells) {
    const used = processSellSingle(sell, buyOrders);

    if (!used.length) continue;

    const avgPrice = weightedAveragePrice(used);

    const profit =
      (Number(sell.feePrice) - avgPrice) *
      Number(sell.amount);

    result.push({
      ...sell,
      price: avgPrice,   // 🔥 replace price
      amount: profit,    // 🔥 replace amount with profit
    });
  }

  return {
    processedSells: result,
    updatedBuys: buyOrders, // amounts reduced
  };
};


