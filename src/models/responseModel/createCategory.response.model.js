const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { CategoryDtoSchema } = require("../dtos/category.dto");

const CreateCategoryResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(201),
  success: z.literal(true),
  message: z.literal("Category created"),
  data: CategoryDtoSchema,
  errors: z.null(),
});

function buildCreateCategoryResponse(category) {
  return CreateCategoryResponseSchema.parse({
    statusCode: 201,
    success: true,
    message: "Category created",
    data: category,
    errors: null,
  });
}

module.exports = {
  CreateCategoryResponseSchema,
  buildCreateCategoryResponse,
};
