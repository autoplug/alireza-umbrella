// src/components/CandleChart.jsx
import React, { useEffect, useRef, useState } from "react";
import { createChart, LineStyle } from "lightweight-charts";
import { useHistory } from "../hooks/useHistory";

export default function CandleChart({ symbol }) {
  const [resolution, setResolution] = useState("60");

  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const priceLinesRef = useRef([]);

  const { candles, isFetching } = useHistory(symbol, resolution);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#000",
      },
      grid: {
        vertLines: { visible: true },
        horzLines: { visible: true },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });

    const series = chart.addCandlestickSeries();

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      chart.applyOptions({
        width: containerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);


  // Update candles when data changes
  const [filteredCandles, setFilteredCandles] = useState([]);
  useEffect(() => {
    if (!candles || !seriesRef.current) return;
    setFilteredCandles(candles);
    seriesRef.current.setData(filteredCandles);
  }, [candles, filteredCandles]);

  // Draw orders as horizontal lines
  useEffect(() => {
    if (!seriesRef.current) return;

    // پاک کردن خطوط قبلی
    priceLinesRef.current.forEach((line) => seriesRef.current.removePriceLine(line));
    priceLinesRef.current = [];

    if (!orders || orders.length === 0) return;

    orders.forEach((order) => {
      const color = order.type === "buy" ? "green" : "red";
      const line = seriesRef.current.createPriceLine({
        price: order.price,
        color,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: `${order.type === "buy" ? "Buy" : "Sell"} ${order.amount}`,
      });
      priceLinesRef.current.push(line);
    });
  }, [orders]);



  return (
    <div style={{ width: "100%" }}>
      
      {/* Chart */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "400px",
        }}
      />
      
      {/* Timeframe buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <button
          onClick={() => setResolution("60")}
          style={{
            padding: "6px 12px",
            background: resolution === "60" ? "#333" : "#eee",
            color: resolution === "60" ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          1H
        </button>

        <button
          onClick={() => setResolution("1D")}
          style={{
            padding: "6px 12px",
            background: resolution === "1D" ? "#333" : "#eee",
            color: resolution === "1D" ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          1D
        </button>

        {isFetching && (
          <span style={{ fontSize: "12px", color: "#999" }}>
            Updating...
          </span>
        )}
      </div>


    </div>
  );
}