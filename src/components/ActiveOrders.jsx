import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

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

  // Format Price with IRM, IRT, USD rules
  const formatPrice = (price, market) => {
    if (price == null) return "";

    let value = Number(price);
    let display = "";

    if (market) {
      const parts = market.split("-");
      const quote = parts[1] || "";

      if (quote.toUpperCase() === "RLS") {
        if (market.toUpperCase() === "USDT-RLS") {
          value = value / 10;
          display = "IRT " + value.toLocaleString("en-US");
        } else if (market.toUpperCase() === "BRC-RLS") {
          display = Math.floor(value / 10000000).toLocaleString("en-US") + " IRM";
        } else {
          display = Math.floor(value / 10000000).toLocaleString("en-US") + " M";
        }
      } else {
        display = value.toLocaleString("en-US");
      }

      // USD text for quote USD (excluding USDT-RLS)
      if (quote.toUpperCase() === "USDT" && market.toUpperCase() !== "USDT-RLS") {
        display = "USD " + display;
      }

      return display;
    }

    return value.toLocaleString("en-US");
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
        Active Orders [{totalOrders}]
      </h3>

      {Object.keys(ordersByMarket).length === 0 ? (
        <p style={{ marginLeft: "20px" }}>No active orders.</p>
      ) : (
        (() => {
          let rowCounter = 0;
          return Object.entries(ordersByMarket).map(([market, orders]) => (
            <div key={market} style={{ marginBottom: "20px" }}>
              {/* Market name 20px from left */}
              <h4 style={{ marginBottom: "6px", marginLeft: "20px" }}>
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
                  {orders.map((order) => {
                    rowCounter += 1;
                    const isBuy = order.type?.toLowerCase() === "buy";
                    const rowColor = isBuy ? "#568546" : "#c2191c";

                    return (
                      <tr key={rowCounter}>
                        <td style={{ ...tdStyle, color: rowColor }}>{rowCounter}</td>
                        <td style={{ ...tdStyle, color: rowColor }}>{formatAmount(order.amount, market)}</td>
                        <td style={{ ...tdStyle, color: rowColor }}>{formatPrice(order.price, market)}</td>
                        <td style={{ ...tdStyle, color: rowColor }}>{renderType(order.type)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ));
        })()
      )}
    </div>
  );
}