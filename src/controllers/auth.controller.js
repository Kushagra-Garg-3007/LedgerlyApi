const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");
const {
  buildSignupSuccessResponse,
  buildSignupConflictResponse,
} = require("../models/responseModel/signUp.response.model");
const {
  buildLoginSuccessResponse,
  buildLoginUnauthorizedResponse,
} = require("../models/responseModel/login.response.model");
const { buildValidationErrorResponse } = require("../models/responseModel/base.response.model");
const { SignupSchema } = require("../models/requestModel/signUp.request.model");
const { LoginSchema } = require("../models/requestModel/login.request.model");

class AuthController {
  constructor() {
    this.signup = asyncHandler(this.signup.bind(this));
    this.login = asyncHandler(this.login.bind(this));
  }

  async signup(req, res) {
    const parsedSignup = SignupSchema.safeParse(req.body);
    if (!parsedSignup.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedSignup.error));
    }

    const signupRequest = parsedSignup.data;
    const result = await authService.signup(signupRequest);

    if (result.status === "conflict") {
      return ApiResponse.send(res, buildSignupConflictResponse());
    }

    return ApiResponse.send(res, buildSignupSuccessResponse(result.user));
  }

  async login(req, res) {
    const parsedLogin = LoginSchema.safeParse(req.body);
    if (!parsedLogin.success) {
      return ApiResponse.send(res, buildValidationErrorResponse(parsedLogin.error));
    }

    const loginRequest = parsedLogin.data;
    const result = await authService.login(loginRequest);

    if (result.status === "unauthorized") {
      return ApiResponse.send(res, buildLoginUnauthorizedResponse());
    }

    return ApiResponse.send(
      res,
      buildLoginSuccessResponse({
        token: result.token,
        user: result.user,
      }),
    );
  }
}

module.exports = new AuthController();
