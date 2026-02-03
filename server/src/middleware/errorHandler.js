export function errorHandler(err, req, res, next) {
  console.error("🔥 API ERROR:", err);

  res.status(500).json({
    ok: false,
    error: "Internal server error",
    details: null,
  });
}
