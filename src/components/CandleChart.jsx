import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { useHistory } from "../hooks/useHistory";

export default function CandleChart({ symbol = "btcrls" }) {
  symbol = symbol.toUpperCase().replace("RLS","IRT").replace("-","");
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  const [resolution, setResolution] = useState("60"); // 60 = 1H, 1D = daily

  const { candles } = useHistory(symbol, resolution);

  // Create chart once
  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#2B2B43" },
      },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries();

    return () => chartRef.current.remove();
  }, []);

  // Set data when candles change
  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      seriesRef.current.setData(candles);
    }
  }, [candles]);

  return (
    <div>
      {/* Timeframe buttons */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setResolution("60")}>1H</button>
        <button onClick={() => setResolution("1D")}>1D</button>
      </div>

      <div ref={chartContainerRef} />
    </div>
  );
}