async function handler(req, res) {
  console.log("API HIT: /api/health");

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use GET."
    });
  }

  try {
    return res.status(200).json({
      success: true,
      data: {
        status: "ok",
        message: "API is working!",
        timestamp: new Date().toISOString(),
        path: req.url
      }
    });
  } catch (error) {
    console.error("❌ Error in /api/health:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
}

module.exports = handler;
