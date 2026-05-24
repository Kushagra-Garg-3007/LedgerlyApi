const jwt = require("jsonwebtoken");
const env = require("../config/env");

function refreshMiddleware(req, res, next) {
  const token = req.cookies?.refreshToken;
  try {
    const payload = jwt.verify(token, env.refreshSecret);
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = refreshMiddleware;
