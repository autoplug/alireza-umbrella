export default {
  async fetch(request) {

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    try {
      const incomingUrl = new URL(request.url);

      // فقط اجازه دسترسی به مسیر مارکت
      if (!incomingUrl.pathname.startsWith("/market/stats")) {
        return new Response(
          JSON.stringify({ error: "Invalid endpoint" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      const targetUrl =
        "https://apiv2.nobitex.ir" +
        incomingUrl.pathname +
        incomingUrl.search;

      const response = await fetch(targetUrl, {
        method: "GET",
      });

      // کپی کامل هدرها
      const headers = new Headers(response.headers);
      headers.set("Access-Control-Allow-Origin", "*");

      // برگرداندن داده بدون هیچ تغییر
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });

    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};