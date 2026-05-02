const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { UserDtoSchema } = require("../dtos/user.dto");

const LoginSuccessDataSchema = z.object({
  token: z.string().min(1),
  user: UserDtoSchema,
});

const LoginResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(200),
  success: z.literal(true),
  message: z.literal("Login successful"),
  data: LoginSuccessDataSchema,
  errors: z.null(),
});

const LoginUnauthorizedResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(401),
  success: z.literal(false),
  message: z.literal("Invalid email or password"),
  data: z.null(),
  errors: z.null(),
});

function buildLoginSuccessResponse({ token, user }) {
  return LoginResponseSchema.parse({
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: {
      token,
      user,
    },
    errors: null,
  });
}

function buildLoginUnauthorizedResponse() {
  return LoginUnauthorizedResponseSchema.parse({
    statusCode: 401,
    success: false,
    message: "Invalid email or password",
    data: null,
    errors: null,
  });
}

module.exports = {
  LoginSuccessDataSchema,
  LoginResponseSchema,
  LoginUnauthorizedResponseSchema,
  buildLoginSuccessResponse,
  buildLoginUnauthorizedResponse,
};
