import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { fetchHistory } from "../api/history";

export default function CandleChart({ symbol = "BTCIRT", width = 600, height = 300 }) {
  const chartContainerRef = useRef();
  const [data, setData] = useState([]);
  const [resolution, setResolution] = useState("1H"); // default hourly

  // Calculate "from" timestamp (last 24h for hourly, last 30 days for daily)
  const computeFrom = (res) => {
    const now = Math.floor(Date.now() / 1000);
    if (res === "1H") return now - 24 * 3600; // last 24 hours
    if (res === "D") return now - 30 * 24 * 3600; // last 30 days
    return now - 24 * 3600;
  };

  // Fetch data whenever resolution changes
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const initialData = await fetchHistory({
        symbol,
        resolution,
        from: computeFrom(resolution),
        to: Math.floor(Date.now() / 1000),
        onUpdate: (newData) => {
          if (mounted) setData(newData);
        },
      });
      if (mounted) setData(initialData);
    };
    loadData();
    return () => { mounted = false; };
  }, [symbol, resolution]);

  // Render chart
  useEffect(() => {
    if (!data || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: { backgroundColor: "#fff", textColor: "#333", fontFamily: "monospace" },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#ccc" },
      timeScale: { borderColor: "#ccc", timeVisible: true },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderDownColor: "#ef5350",
      borderUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      wickUpColor: "#26a69a",
    });

    candleSeries.setData(
      data.map((d) => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close }))
    );

    // Handle resize
    const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    window.addEventListener("resize", handleResize);

    return () => { window.removeEventListener("resize", handleResize); chart.remove(); };
  }, [data, width, height]);

  return (
    <div>
      {/* Buttons for selecting resolution */}
      <div style={{ marginBottom: "10px" }}>
        <button
          style={{ marginRight: 6, padding: "4px 12px", fontWeight: resolution === "1H" ? "bold" : "normal" }}
          onClick={() => setResolution("1H")}
        >
          Hourly
        </button>
        <button
          style={{ padding: "4px 12px", fontWeight: resolution === "D" ? "bold" : "normal" }}
          onClick={() => setResolution("D")}
        >
          Daily
        </button>
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} style={{ width, height }} />
    </div>
  );
}