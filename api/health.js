function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  return res.json({
    status: "ok",
    message: "API is working!",
    timestamp: new Date().toISOString(),
    path: req.url
  });
}

module.exports = handler;
