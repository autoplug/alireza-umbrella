const applyFee = (orders) =>
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

const removeDuplica