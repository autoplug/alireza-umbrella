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
    buy.amount -= take; // decrease remaining buy amount
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