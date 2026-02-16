addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type"); // wallets / orders / markets

    let apiUrl = "";
    const headers = {};

    // Token از Header می‌خوانیم (برای orders و wallets)
    const token = request.headers.get("Authorization");
    if (token) headers["Authorization"] = token;

    // انتخاب endpoint بر اساس type
    switch (type) {
      case "wallets":
        apiUrl = "https://apiv2.nobitex.ir/users/wallets/list";
        break;

      case "orders":
        apiUrl = "https://apiv2.nobitex.ir/market/orders/list";
        break;

      case "markets":
        apiUrl = "https://apiv2.nobitex.ir/market/stats";
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    // درخواست به نوبیتکس
    const response = await fetch(apiUrl, { method: "GET", headers });
    const data = await response.json();

    // پاسخ به مرورگر با CORS فعال
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}