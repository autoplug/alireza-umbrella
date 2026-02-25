import React, { useState, useEffect } from "react";

import CandleChart from "../components/CandleChart";
import TableOrder from "../components/TableOrder";
import { useTrades } from "../hooks/useTrades";
import { useOrders } from "../hooks/useOrders";

export default function Chart() {
  const { trades } = useTrades();   // همه معاملات
  const { orders } = useOrders();   // همه سفارشات فعال

  const symbols = Array.from(
    new Set([
      ...trades.map(t => t.market.toLowerCase()),
    ])
  );

  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  
  
  
  const [filteredTrades, setFilteredTrades] = useState([]);
  useEffect(() => {
      if (!trades) return;
      
      const result = trades?.filter((trade) => {
        const oneWeekAgo = Math.floor(Date.now()) - 7 * 24 * 60 * 60 * 1000;
        return (
          trade.market?.toLowerCase() === selectedSymbol?.toLowerCase() &&
          trade.time >= oneWeekAgo
        );
      }) || [];
  
      setFilteredTrades(result);
    }, [trades, selectedSymbol]);
    
    
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
      {/* Chart */}
      <CandleChart 
        symbol={selectedSymbol} 
        orders={filteredOrders}
        trades={filteredTrades}
      />
      
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

      {/* Orders Table */}
      <TableOrder orders={filteredOrders} />

      {/* Trades Ladlst 10 trade Table */}
      <TableOrder orders={filteredTrades} />
    
    </div>
  );
}