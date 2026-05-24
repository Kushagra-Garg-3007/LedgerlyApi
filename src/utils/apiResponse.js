class ApiResponse {
  constructor({
    statusCode = 200,
    message = "Success",
    data = null,
    success = statusCode < 400,
    errors = null,
  } = {}) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static send(res, options = {}) {
    const payload =
      options && typeof options.toJSON === "function" ? options.toJSON() : options;
    const response = new ApiResponse(payload);
    return res.status(response.statusCode).json(response);
  }

  static success(res, { message = "Success", data = null, statusCode = 200 } = {}) {
    return ApiResponse.send(res, { statusCode, message, data, success: true });
  }

  static error(
    res,
    { message = "Something went wrong", statusCode = 500, errors = null } = {},
  ) {
    return ApiResponse.send(res, {
      statusCode,
      message,
      errors,
      success: false,
      data: null,
    });
  }
}

module.exports = ApiResponse;
