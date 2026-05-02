const ApiResponse = require("../utils/apiResponse");

function notFoundHandler(req, res) {
  return ApiResponse.error(res, {
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return ApiResponse.error(res, {
    statusCode,
    message,
    errors: error.errors || null,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
