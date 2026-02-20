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
  const lowest = relevantBuys.sort(
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
  const highest = relevantBuys.sort(
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

// ---------------- PROCESS SELL ORDERS ----------------
export const processAllSells = (sellOrders, buyOrders) => {
  // 🔥 Copy arrays to avoid mutation
  const buys = JSON.parse(JSON.stringify(buyOrders));
  const sells = JSON.parse(JSON.stringify(sellOrders));


  // 🔥 Apply fee once
  applyFee(buys);
  applyFee(sells);

  const processedSells = [];

  // 🔹 Sort sell orders by creation time ascending
  const sortedSells = sells.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  for (const sell of sortedSells) {
    // 🔹 Process this sell against current buy orders
    const used = processSellSingle(sell, buys);

    if (!used.length) continue;

    const avgPrice = weightedAveragePrice(used);
    const sellPrice = Number(sell.feePrice || sell.price || 0);

    // 🔹 Profit = (sell price after fee - weighted average of buys) * amount sold
    const profit = (sellPrice - avgPrice) * Number(sell.amount);

    processedSells.push({
      ...sell,
      price: avgPrice,   // replace price with weighted average
      amount: profit,    // replace amount with profit
      usedBuys: used,    // optional: store which buys were used
    });
  }

  return {
    processedSells,
    updatedBuys: buys,  // buy amounts reduced by consumption
  };
};

// ---------------- FORMAT PRICE ----------------
export const formatPrice = (price, market) => {
  let value = Number(price);

  // Return zero if value is invalid
  if (!value || isNaN(value)) return "0";

  // Extract quote currency from market string (e.g. BTC-IRT → IRT)
  let quoteCurrency = market.includes("-") ?
    market?.split("-")[1]?.toUpperCase():market;

  // ===== IRT (Iranian Rial) =====
  if (quoteCurrency === "RLS") {
    if (value < 100_000_000) {
      // Remove one zero (divide by 10)
      value = value / 10;
      return "IRT " + Math.floor(value).toLocaleString("en-US");
    } else {
      // Remove seven zeros (divide by 10,000,000)
      value = value / 10_000_000;
      return "IRM " + Math.floor(value).toLocaleString("en-US");
    }
  }

  // ===== USD / USDT =====
  if (quoteCurrency === "USD" || quoteCurrency === "USDT") {
    if (value < 10) {
      // Show two decimal places if below 10
      return "USD " + value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      // No decimals if 10 or above
      return "USD " + Math.floor(value).toLocaleString("en-US");
    }
  }

  // ===== Default fallback =====
  return value.toLocaleString("en-US");
};

