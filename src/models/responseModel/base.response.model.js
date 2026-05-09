const { z } = require("zod");

const BaseResponseSchema = z.object({
  statusCode: z.number().int(),
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().nullable(),
  errors: z.unknown().nullable().optional(),
});

const ValidationErrorResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(400),
  success: z.literal(false),
  message: z.literal("Validation failed"),
  data: z.null(),
  errors: z.array(
    z.object({
      path: z.string(),
      message: z.string(),
    }),
  ),
});

function buildValidationErrorResponse(error) {
  const validationErrors = [];
  for (const issue of error.issues) {
    validationErrors.push({
      path: issue.path.join("."),
      message: issue.message,
    });
  }

  return ValidationErrorResponseSchema.parse({
    statusCode: 400,
    success: false,
    message: "Validation failed",
    data: null,
    errors: validationErrors,
  });
}

module.exports = {
  BaseResponseSchema,
  ValidationErrorResponseSchema,
  buildValidationErrorResponse,
};
