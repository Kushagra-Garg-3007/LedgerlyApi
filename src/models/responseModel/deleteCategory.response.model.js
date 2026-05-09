const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");

const DeleteCategoryResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(200),
  success: z.literal(true),
  message: z.literal("Category deleted"),
  data: z.object({ deleted: z.boolean() }),
  errors: z.null(),
});

function buildDeleteCategoryResponse(deleted) {
  return DeleteCategoryResponseSchema.parse({
    statusCode: 200,
    success: true,
    message: "Category deleted",
    data: { deleted },
    errors: null,
  });
}

module.exports = {
  DeleteCategoryResponseSchema,
  buildDeleteCategoryResponse,
};
