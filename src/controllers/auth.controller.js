const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");
const { SignupSchema } = require("../models/requestModel/signUp.request.model");
const { LoginSchema } = require("../models/requestModel/login.request.model");
const { throwValidationError } = require("../utils/validation");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
}

class AuthController {
  constructor() {
    this.signup = asyncHandler(this.signup.bind(this));
    this.login = asyncHandler(this.login.bind(this));
  }

  async signup(req, res) {
    const parsedSignup = SignupSchema.safeParse(req.body);
    if (!parsedSignup.success) {
      throwValidationError(parsedSignup.error);
    }

    const signupRequest = parsedSignup.data;
    const result = await authService.signup(signupRequest);

    if (result.status === "conflict") {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    return res.status(201).json(result.user);
  }

  async login(req, res) {
    const parsedLogin = LoginSchema.safeParse(req.body);
    if (!parsedLogin.success) {
      throwValidationError(parsedLogin.error);
    }

    const loginRequest = parsedLogin.data;
    const result = await authService.login(loginRequest);

    if (result.status === "unauthorized") {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    res.cookie("accessToken", result.accessToken, {
      cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  }

  async logout(req, res) {
    res.clearCookie("accessToken", cookieOptions)
    res.clearCookie("refreshToken", cookieOptions)
    return res.status(200).json({ loggedOut: true });
  }

  async profile(req, res) {
    res.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private',
    )

    return res.status(200).json({
      success: true,
      data: req.user,
    })
  }

  async refresh(req, res) {
    const user = req.user;
    const token = authService.refresh(user);
    res.cookie("accessToken", token, {
      cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({ accessToken: token });
  }
}

module.exports = new AuthController();
