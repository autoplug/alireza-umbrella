import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

// Logos
import BTCLogo from "../assets/logos/btc.PNG";
import ETHLogo from "../assets/logos/eth.PNG";
import USDTLogo from "../assets/logos/usdt.PNG";
import RLSLogo from "../assets/logos/rls.jpg";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#f9f9f9",
  margin: 0,
  fontWeight: "bold",
};

const thStyle = {
  borderBottom: "1px solid #aaa",
  textAlign: "left",
  padding: "8px 20px",
  fontSize: "14px",
};

const tdStyle = {
  borderBottom: "1px solid #ddd",
  padding: "6px 20px",
  fontSize: "12px",
};

// Map currency codes to logos
const logoMap = {
  BTC: BTCLogo,
  ETH: ETHLogo,
  USDT: USDTLogo,
  RLS: RLSLogo,
};

// MarketIcon with Base on top of Quote
const MarketIcon = ({ market }) => {
  const [base, quote] = market.split("-");
  const baseImg = logoMap[base] || "";
  const quoteImg = logoMap[quote] || "";

  return (
    <div style={{ position: "relative", width: "28px", height: "20px" }}>
      {/* Quote behind, slightly right but same top */}
      <img
        src={quoteImg}
        alt=""
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          position: "absolute",
          left: 12,   // overlap behind
          top: 0,    // same vertical as base
          zIndex: 0,
        }}
      />
      {/* Base on top */}
      <img
        src={baseImg}
        alt=""
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default function ActiveOrders() {
  const [ordersByMarket, setOrdersByMarket] = useState({});

  const loadOrdersFromCache = () => {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    if (!cached) {
      setOrdersByMarket({});
      return;
    }

    try {
      const allOrders = JSON.parse(cached);
      const activeOrders = allOrders.filter((o) => o.status === "Active");

      const grouped = activeOrders.reduce((acc, order) => {
        const key = order.market || "Unknown";
        if (!acc[key]) acc[key] = [];
        acc[key].push(order);
        return acc;
      }, {});

      setOrdersByMarket(grouped);
    } catch {
      setOrdersByMarket({});
    }
  };

  useEffect(() => {
    loadOrdersFromCache();
    const interval = setInterval(loadOrdersFromCache, 30000);
    return () => clearInterval(interval);
  }, []);

  // Total active orders
  const totalOrders = Object.values(ordersByMarket).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  // Format Amount with BTC special case
  const formatAmount = (amount, market) => {
    if (amount == null) return "";

    if (market && market.toUpperCase().startsWith("BTC")) {
      const newAmount = Number(amount) * 1000000;
      return newAmount.toLocaleString("en-US") + " e-6";
    }

    return Number(amount).toLocaleString("en-US");
  };

  // Format Price with IRM, IRT, USD rules (M removed)
  const formatPrice = (price, market) => {
    if (price == null) return "";

    let value = Number(price);
    let unit = ""; // unit displayed on right

    if (market) {
      const parts = market.split("-");
      const quote = parts[1] || "";

      if (quote.toUpperCase() === "RLS") {
        if (market.toUpperCase() === "USDT-RLS") {
          value = value / 10;
          unit = "IRT";
        } else if (market.toUpperCase() === "BRC-RLS") {
          value = Math.floor(value / 10000000);
          unit = "IRM";
        } else if (market.toUpperCase() === "BTC-RLS") {
          value = Math.floor(value / 10000000);
          unit = "IRM";
        } else {
          value = Math.floor(value / 10000000);
          unit = ""; // M removed
        }
      } else if (quote.toUpperCase() === "USDT" && market.toUpperCase() !== "USDT-RLS") {
        unit = "USD";
      }
    }

    return unit ? `${value.toLocaleString("en-US")} ${unit}` : `${value.toLocaleString("en-US")}`;
  };

  // Render Type with colored circle arrow
  const renderType = (type) => {
    if (!type) return "";

    const isBuy = type.toLowerCase() === "buy";

    return (
      <span
        style={{
          color: isBuy ? "#568546" : "#c2191c",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <FontAwesomeIcon
          icon={isBuy ? faCircleArrowUp : faCircleArrowDown}
          size="sm"
        />
        {type}
      </span>
    );
  };

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      {/* Header 10px from left with order count inside [ ] */}
      <h3 style={{ marginLeft: "10px" }}>
        Active Orders ({totalOrders})
      </h3>

      {Object.keys(ordersByMarket).length === 0 ? (
        <p style={{ marginLeft: "20px" }}>No active orders.</p>
      ) : (
        (() => {
          let rowCounter = 0;
          return Object.entries(ordersByMarket).map(([market, orders]) => {
            // Sort by timestamp descending (newest first)
            const sortedOrders = [...orders].sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );

            return (
              <div key={market} style={{ marginBottom: "20px" }}>
                {/* Market name 20px from left with icons */}
                <h4
                  style={{
                    marginBottom: "6px",
                    marginLeft: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <MarketIcon market={market} />
                  {market}
                </h4>

                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: "5%" }}>#</th>
                      <th style={{ ...thStyle, width: "40%" }}>Amount</th>
                      <th style={{ ...thStyle, width: "40%" }}>Price</th>
                      <th style={{ ...thStyle, width: "15%" }}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map((order, index) => {
                      rowCounter += 1;
                      const isBuy = order.type?.toLowerCase() === "buy";
                      const baseColor = isBuy ? "#568546" : "#c2191c";

                      // Alternate row background (white / very light gray)
                      const bgColor = index % 2 === 0 ? "#ffffff" : "#fafafa";

                      return (
                        <tr key={rowCounter} style={{ backgroundColor: bgColor }}>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {rowCounter}
                          </td>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {formatAmount(order.amount, market)}
                          </td>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {formatPrice(order.price, market)}
                          </td>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {renderType(order.type)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          });
        })()
      )}
    </div>
  );
}