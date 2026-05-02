const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { UserDtoSchema } = require("../dtos/user.dto");

const SignupResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(201),
  success: z.literal(true),
  message: z.literal("Signup successful"),
  data: UserDtoSchema,
  errors: z.null(),
});

const SignupConflictResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(409),
  success: z.literal(false),
  message: z.literal("User already exists"),
  data: z.null(),
  errors: z.null(),
});

function buildSignupSuccessResponse(userDto) {
  return SignupResponseSchema.parse({
    statusCode: 201,
    success: true,
    message: "Signup successful",
    data: userDto,
    errors: null,
  });
}

function buildSignupConflictResponse() {
  return SignupConflictResponseSchema.parse({
    statusCode: 409,
    success: false,
    message: "User already exists",
    data: null,
    errors: null,
  });
}

module.exports = {
  SignupResponseSchema,
  SignupConflictResponseSchema,
  buildSignupSuccessResponse,
  buildSignupConflictResponse,
};
