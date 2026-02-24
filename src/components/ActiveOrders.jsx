import React, { useEffect, useState } from "react";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

import { useOrders } from "../hooks/useOrders";

export default function ActiveOrders() {
  const { orders } = useOrders();
  

  return (
    <div>
      <TitleBar title="Active Orders" count={orders.length} />
      <TableOrder orders={orders} />
    </div>
  );
}