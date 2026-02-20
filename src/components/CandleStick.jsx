import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandleStick() {
  const chartRef = useRef();

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: 800,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      rightPriceScale: {
        borderColor: "#ddd",
      },
      timeScale: {
        borderColor: "#ddd",
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // Sample BTC daily data
    candleSeries.setData([
      { time: "2026-02-10", open: 62000, high: 63500, low: 61500, close: 63000 },
      { time: "2026-02-11", open: 63000, high: 64000, low: 62500, close: 63800 },
      { time: "2026-02-12", open: 63800, high: 65000, low: 63200, close: 64500 },
      { time: "2026-02-13", open: 64500, high: 65500, low: 64000, close: 64200 },
      { time: "2026-02-14", open: 64200, high: 66000, low: 64000, close: 65500 },
      { time: "2026-02-15", open: 65500, high: 67000, low: 65000, close: 66800 },
    ]);

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, []);

  return <div ref={chartRef} />;
}