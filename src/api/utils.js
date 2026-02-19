

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

export const processSell = (sellOrders, buyOrders) => {
  // Apply fee to all orders (copy to avoid mutation)
  const buys = applyFee([...buyOrders]);
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
      processedSells.push({
        market: sell.market,
        amount: 0,          // no profit if no buys
        price: sell.feePrice,
        type: "sell",
        created_at: sell.created_at,
        profit: 0,
      });
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

    // ===== Calculate weighted average price and profit =====
    const avgPrice = weightedAveragePrice(usedBuys);
    const profit = (sell.feePrice - avgPrice) * Number(sell.amount);

    // Save processed sell with avg price as 'price' and profit in 'amount'
    processedSells.push({
      market: sell.market,
      amount: profit,     // replace amount with profit
      price: avgPrice,    // weighted average price
      type: "sell",
      created_at: sell.created_at,
      profit,             // original profit as well (optional)
    });
  }

  return {
    processedSells,    // sell orders ready for table
    updatedBuys: buys, // updated buy orders
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

