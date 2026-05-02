const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { AnnotationDtoSchema } = require("../dtos/annotation.dto");

const UpdateTransactionAnnotationResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(200),
  success: z.literal(true),
  message: z.literal("Transaction annotation updated"),
  data: AnnotationDtoSchema.nullable(),
  errors: z.null(),
});

function buildUpdateTransactionAnnotationResponse(annotationDto) {
  return UpdateTransactionAnnotationResponseSchema.parse({
    statusCode: 200,
    success: true,
    message: "Transaction annotation updated",
    data: annotationDto,
    errors: null,
  });
}

module.exports = {
  UpdateTransactionAnnotationResponseSchema,
  buildUpdateTransactionAnnotationResponse,
};
