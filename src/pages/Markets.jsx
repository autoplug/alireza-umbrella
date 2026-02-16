import React, { useEffect, useState } from "react";
import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

function Markets() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("NOBITEX_TOKEN");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${WORKER_URL}?type=myorders`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Order fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const formatPrice = (price) => {
    const toman = Math.floor(Number(price) / 10);
    return toman.toLocaleString();
  };

  return (
    <div style={{ padding: 16, paddingBottom: 120 }}>
      <h2>My Orders</h2>

      {loading && <div>Loading...</div>}

      {!loading && orders.length === 0 && (
        <div>No orders found</div>
      )}

      {!loading &&
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 16,
              marginBottom: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {order.srcCurrency.toUpperCase()} /{" "}
              {order.dstCurrency.toUpperCase()}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <span>
                Price: {formatPrice(order.price)} تومان
              </span>

              <span>
                Amount: {Number(order.amount).toFixed(4)}
              </span>
            </div>

            <div
              style={{
                marginTop: 6,
                color:
                  order.status === "active"
                    ? "orange"
                    : order.status === "done"
                    ? "green"
                    : "red",
              }}
            >
              {order.status}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Markets;