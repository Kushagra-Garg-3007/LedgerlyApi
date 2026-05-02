const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { UploadDtoSchema } = require("../dtos/upload.dto");

const UploadStatementResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(201),
  success: z.literal(true),
  message: z.literal("Statement upload recorded"),
  data: UploadDtoSchema,
  errors: z.null(),
});

function buildUploadStatementResponse(uploadDto) {
  return UploadStatementResponseSchema.parse({
    statusCode: 201,
    success: true,
    message: "Statement upload recorded",
    data: uploadDto,
    errors: null,
  });
}

module.exports = {
  UploadStatementResponseSchema,
  buildUploadStatementResponse,
};
