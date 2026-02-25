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
  ).sort((a, b) => a.localeCompare(b));

  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  
  
  
  const [filteredTrades, setFilteredTrades] = useState([]);
  useEffect(() => {
      if (!trades) return;
      
      const result = trades?.filter((trade) => {
        const oneWeekAgo = Math.floor(Date.now()) - 7 * 24 * 60 * 60 * 1000;
        const tradeTime = new Date(trade.timestamp).getTime();
        return (
          trade.market?.toLowerCase() === selectedSymbol?.toLowerCase() &&
          tradeTime >= oneWeekAgo
        );
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) 
      || [];
  
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
      <div
        style={{
          display: "flex",
          width: "calc(100% - 10px)",         
          margin: "0 5px",
          marginBottom: "10px",
          borderRadius: "8px",     // گوشه‌های گرد
          overflow: "hidden",      // جلوگیری از بیرون زدن گوشه‌ها
          border: "1px solid #ccc" // حاشیه یکپارچه
        }}
      >
        {symbols.map((s, index) => (
          <button
            key={s}
            onClick={() => setSelectedSymbol(s)}
            style={{
              flex: 1,                 // هر دکمه مساوی عرض بگیرد
              padding: "10px 0",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              background: selectedSymbol === s ? "#333" : "#eee",
              color: selectedSymbol === s ? "#fff" : "#000",
              borderRight: index !== symbols.length - 1 ? "1px solid #ccc" : "none", // خط جداکننده
              transition: "all 0.2s ease"
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>


      {/* Orders Table */}
      <TableOrder orders={filteredOrders} sortBy={"time"} />

      {/* Trades Ladlst 10 trade Table */}
      <TableOrder orders={filteredTrades} sortBy={"time"}/>
    
      <div style={{ height: "60px" }}></div>
    </div>
  );
}