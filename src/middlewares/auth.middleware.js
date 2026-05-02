const jwt = require("jsonwebtoken");
const env = require("../config/env");
const ApiResponse = require("../utils/apiResponse");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.error(res, { statusCode: 401, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (_error) {
    return ApiResponse.error(res, { statusCode: 401, message: "Invalid token" });
  }
}

module.exports = authMiddleware;
