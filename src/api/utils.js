

// ---------------- APPLY FEE ----------------
export const applyFee = (orders) =>
  orders.map((order) => {
    const newOrder = { ...order }; // avoid mutating original
    const amt = Number(newOrder.amount) || 0;
    const price = Number(newOrder.price) || 0;
    const fee = Number(newOrder.fee || 0);

    if (newOrder.type?.toLowerCase() === "buy" && amt > 0) {
      newOrder.feePrice = price * (1 + fee / amt);
    } else if (newOrder.type?.toLowerCase() === "sell" && amt > 0) {
      const totalPrice = price * amt;
      newOrder.feePrice = totalPrice > 0 ? price * (1 - fee / totalPrice) : price;
    }

    return newOrder;
  });
  
  
// ---------------- PROCESS SELL ----------------
export const processSellSingle = (sellOrder, buyOrders) => {
  const sellAmount = Number(sellOrder.amount);

  // Filter buy orders before this sell with remaining amount
  const relevantBuys = buyOrders.filter(
    (b) =>
      new Date(b.created_at) < new Date(sellOrder.created_at) &&
      Number(b.amount) > 0
  );

  if (!relevantBuys.length) {
    return [];
  }

  let amount90 = sellAmount * 0.9; // 90% from lowest price buys
  let amount10 = sellAmount * 0.1; // 10% from highest price buys

  const used = [];

  // ===== 90% from lowest price buys =====
  const lowestBuys = relevantBuys.sort(
    (a, b) => Number(a.price) - Number(b.price)
  );

  for (const buy of lowestBuys) {
    if (amount90 <= 0) break;

    const take = Math.min(amount90, Number(buy.amount));

    used.push({
      price: Number(buy.feePrice),
      used_amount: take,
    });

    // 🔥 directly modify original buyOrders
    buy.amount = Number(buy.amount) - take;

    amount90 -= take;
  }

  // ===== 10% from highest price buys =====
  const highestBuys = relevantBuys.sort(
    (a, b) => Number(b.price) - Number(a.price)
  );

  for (const buy of highestBuys) {
    if (amount10 <= 0) break;

    const take = Math.min(amount10, Number(buy.amount));

    used.push({
      price: Number(buy.feePrice),
      used_amount: take,
    });

    // 🔥 directly modify original buyOrders
    buy.amount = Number(buy.amount) - take;

    amount10 -= take;
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

