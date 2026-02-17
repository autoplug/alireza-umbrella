export default {
  async fetch(request) {
    try {
      // Parse the incoming request URL
      const incomingUrl = new URL(request.url);

      /*
        Build the target Nobitex API URL.

        Example:
        Incoming request:
        https://your-worker.workers.dev/users/wallets/list?foo=bar

        Forwarded to:
        https://apiv2.nobitex.ir/users/wallets/list?foo=bar
      */
      const targetUrl =
        "https://apiv2.nobitex.ir" +
        incomingUrl.pathname +
        incomingUrl.search;

      /*
        Create a new request to Nobitex:
        - Same HTTP method (GET, POST, etc.)
        - Same headers (including Authorization)
        - Same body (for non-GET/HEAD requests)
      */
      const proxiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body:
          request.method !== "GET" && request.method !== "HEAD"
            ? request.body
            : undefined,
      });

      // Send the request to Nobitex API
      const response = await fetch(proxiedRequest);

      /*
        Return the response exactly as received:
        - Same status code
        - Same response body
        - Forward original headers
        - Add CORS header for browser access
      */
      return new Response(response.body, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      // Handle unexpected runtime errors
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
  }
};