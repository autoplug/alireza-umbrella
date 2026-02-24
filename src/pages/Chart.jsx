import React, { useState, useMemo } from "react";
import CandleChart from "../components/CandleChart";
import { useTrades } from "../hooks/useTrades";
import { useOrders } from "../hooks/useOrders";

export default function Chart() {
  const { trades } = useTrades();   // همه معاملات
  const { orders } = useOrders();   // همه سفارشات

  // لیست ارزهای unique از trades
  const symbols = useMemo(() => {
    const set = new Set(trades.map(t => t.symbol));
    return Array.from(set);
  }, [trades]);

  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0] || null);

  if (!selectedSymbol) return <div>Loading...</div>;

  // فیلتر کردن سفارشات و معاملات برای ارز انتخاب شده
  const filteredOrders = orders.filter(o => o.symbol === selectedSymbol);

  // فقط 10 معامله آخر برای نمایش
  const filteredTrades = trades
    .filter(t => t.symbol === selectedSymbol)
    .sort((a, b) => a.time - b.time)  // مرتب سازی بر اساس زمان
    .slice(-10);  // ۱۰ معامله آخر

  return (
    <div style={{ padding: 16 }}>
      <h2>Chart</h2>

      {/* دکمه‌های انتخاب ارز */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        {symbols.map((sym) => (
          <button
            key={sym}
            onClick={() => setSelectedSymbol(sym)}
            style={{
              padding: "6px 12px",
              background: selectedSymbol === sym ? "#333" : "#eee",
              color: selectedSymbol === sym ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {sym}
          </button>
        ))}
      </div>

      {/* چارت */}
      <CandleChart
        symbol={selectedSymbol}
        orders={filteredOrders}
        trades={filteredTrades} // فقط 10 معامله آخر
      />
    </div>
  );
}