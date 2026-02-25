// src/components/CandleChart.jsx
import React, { useEffect, useRef, useState } from "react";
import { createChart, LineStyle } from "lightweight-charts";
import { useHistory } from "../hooks/useHistory";
import { formatChartPrice } from "../api/utils";

export default function CandleChart({ symbol, orders, trades }) {
  const [resolution, setResolution] = useState("60");

  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const priceLinesRef = useRef([]);

  const { candles, isFetching } = useHistory(symbol, resolution);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    // remove previous chart if exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
      priceLinesRef.current = [];
    }
  
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      //barSpacing: containerRef.current.clientWidth/100,
      rightPriceScale: {
        autoScale: true,
        borderVisible: true,
      },
      layout: {
        background: { color: "#ffffff" },
        textColor: "#000",
      },
      grid: {
        vertLines: { visible: true },
        horzLines: { visible: false },
      },
      timeScale: { borderVisible: true },
    });

    const series = chart.addCandlestickSeries({
      priceFormat: {
        type: "custom",
        minMove: 1,     // حداقل تغییر قیمت
        formatter: (price) => {
          return Number(price).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            });
        },
      },
    });

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
    if (!candles || !seriesRef.current || !chartRef.current) return;
  
    // clear previous data
    seriesRef.current.setData([]);
  

    // set new data
    seriesRef.current.setData(candles);
    
    // reset time scale completely
    chartRef.current.timeScale().resetTimeScale();
    
    const total = candles.length;
    const visibleBars = 120;
    
    if (total > visibleBars) {
      chartRef.current.timeScale().setVisibleLogicalRange({
        from: total - visibleBars,
        to: total,
      });
    }


    // reset price scale
    chartRef.current.priceScale("right").applyOptions({autoScale: true,});
    
    // fit visible range and scroll to latest candle
    //chartRef.current.timeScale().fitContent();
    chartRef.current.timeScale().scrollToRealTime();
  }, [candles, symbol]); // run again when candles OR symbol changes
  


  // Draw orders as horizontal lines
  const [filteredOrders, setFilteredOrders] = useState([]);
  useEffect(() => {
    if (!seriesRef.current) return;
    setFilteredOrders(orders);
    // Remove old price
    priceLinesRef.current.forEach((line) => seriesRef.current.removePriceLine(line));
    priceLinesRef.current = [];

    if (!filteredOrders || filteredOrders.length === 0) return;
    
    filteredOrders.forEach((order) => {
      const color = order.type === "buy" ? "green" : "red";
      const line = seriesRef.current.createPriceLine({
        price: formatChartPrice(order.price, symbol),
        color,
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: `${order.type === "buy" ? "Buy" : "Sell"} ${order.amount}`,
      });
      priceLinesRef.current.push(line);
    });
  }, [orders, filteredOrders, symbol]);


 // Draw marker for trades
  useEffect(() => {
    if (!seriesRef.current || !trades) return;
  
    const markers = trades.map((trade) => ({
        time: Math.floor(new Date(trade.timestamp).getTime() / 1000), // 🔥 seconds
        position: trade.type === "buy" ? "belowBar" : "aboveBar",
        color: trade.type === "buy" ? "green" : "red",
        shape: trade.type === "buy" ? "arrowUp" : "arrowDown",
        text: "",
      }));
  
    seriesRef.current.setMarkers(markers);
  }, [trades, symbol]);




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