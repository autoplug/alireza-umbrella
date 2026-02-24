// src/components/CandleChart.jsx
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { useHistory } from "../hooks/useHistory";

export default function CandleChart({ symbol, resolution }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const { candles } = useHistory(symbol, resolution);

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
        vertLines: { visible: false },
        horzLines: { visible: false },
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
  useEffect(() => {
    if (!candles || !seriesRef.current) return;

    // Expected format from API:
    // [{ time, open, high, low, close }]

    seriesRef.current.setData(candles);
  }, [candles]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "400px",
      }}
    />
  );
}