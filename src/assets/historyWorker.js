// history-worker.js
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const symbol = url.searchParams.get("symbol");
    const resolution = url.searchParams.get("resolution") || "1H";
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    if (!symbol || !from || !to) {
      return new Response(
        JSON.stringify({ error: "Missing required params: symbol, from, to" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch directly from Nobitex API
    const apiUrl = `https://apiv2.nobitex.ir/market/udf/history?symbol=${encodeURIComponent(
      symbol
    )}&resolution=${encodeURIComponent(resolution)}&from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}`;

    const resp = await fetch(apiUrl);
    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}