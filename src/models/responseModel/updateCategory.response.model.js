const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { CategoryDtoSchema } = require("../dtos/category.dto");

const UpdateCategoryResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(200),
  success: z.literal(true),
  message: z.literal("Category updated"),
  data: CategoryDtoSchema.nullable(),
  errors: z.null(),
});

function buildUpdateCategoryResponse(category) {
  return UpdateCategoryResponseSchema.parse({
    statusCode: 200,
    success: true,
    message: "Category updated",
    data: category,
    errors: null,
  });
}

module.exports = {
  UpdateCategoryResponseSchema,
  buildUpdateCategoryResponse,
};
