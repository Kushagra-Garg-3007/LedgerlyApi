const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");

const UploadInvalidPayloadResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(400),
  success: z.literal(false),
  message: z.literal("Invalid upload payload"),
  data: z.null(),
  errors: z.null(),
});

function buildUploadInvalidPayloadResponse() {
  return UploadInvalidPayloadResponseSchema.parse({
    statusCode: 400,
    success: false,
    message: "Invalid upload payload",
    data: null,
    errors: null,
  });
}

module.exports = {
  UploadInvalidPayloadResponseSchema,
  buildUploadInvalidPayloadResponse,
};
