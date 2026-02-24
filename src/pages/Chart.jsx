import React, { useState, useEffect } from "react";

//import CandleChart from "../components/CandleChart";
//import TableOrder from "../components/TableOrder";
import { useTrades } from "../hooks/useTrades";
//import { useOrders } from "../hooks/useOrders";

export default function Chart() {
  const { trades } = useTrades();   // همه معاملات
  //const { orders } = useOrders();   // همه سفارشات فعال

  const symbols = Array.from(
    new Set([
      ...trades.map(t => t.market.toLowerCase()),
    ])
  );

  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  
  const [filteredOrders, setFilteredOrders] = useState([]);
  useEffect(() => {
      if (!orders) return;
  
      const result = orders.filter(
        (o) => o.market.toLowerCase() === selectedSymbol.toLowerCase()
      );
  
      setFilteredOrders(result);
    }, [orders, selectedSymbol]);

  return (
    <div>
      { filteredOrders.length }
      {/* Symbol Buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        {symbols.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSymbol(s)}
            style={{
              padding: "6px 12px",
              background: s === selectedSymbol ? "#333" : "#eee",
              color: s === selectedSymbol ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chart */}
    

      {/* Orders Table */}
    
    </div>
  );
}