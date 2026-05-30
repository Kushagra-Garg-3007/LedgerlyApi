const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { toBigIntId } = require("../utils/id.utils");

function authMiddleware(req, res, next) {
  const token = req.cookies?.accessToken;

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    payload.id = toBigIntId(payload.id);
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
