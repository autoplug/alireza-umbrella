export default {
  async fetch(request) {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const token = request.headers.get("Authorization");

    // 1️⃣ Wallets
    if (type === "wallets") {
      if (!token) {
        return jsonResponse({ error: "No token provided" }, 401);
      }

      const response = await fetch(
        "https://apiv2.nobitex.ir/users/wallets/list",
        {
          method: "GET",
          headers: { Authorization: token },
        }
      );

      const data = await response.json();
      return jsonResponse(data);
    }

    // 2️⃣ Orders with details=2 & status=all
    if (type === "orders") {
      if (!token) {
        return jsonResponse({ error: "No token provided" }, 401);
      }

      const apiUrl =
        "https://apiv2.nobitex.ir/market/orders/list?details=2&status=all";

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { Authorization: token },
      });

      const data = await response.json();
      return jsonResponse(data);
    }

    // 3️⃣ Markets (no token needed)
    if (type === "markets") {
      const response = await fetch("https://apiv2.nobitex.ir/market/stats", {
        method: "GET",
      });

      const data = await response.json();
      return jsonResponse({ markets: data }); // wrap in 'markets' key
    }

    // Invalid type
    return jsonResponse({ error: "Invalid request type" }, 400);
  },
};

// Helper function to add CORS headers
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}