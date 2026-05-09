const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { CategoryDtoSchema } = require("../dtos/category.dto");

const ListCategoriesResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(200),
  success: z.literal(true),
  message: z.literal("Categories fetched"),
  data: z.array(CategoryDtoSchema),
  errors: z.null(),
});

function buildListCategoriesResponse(categories) {
  return ListCategoriesResponseSchema.parse({
    statusCode: 200,
    success: true,
    message: "Categories fetched",
    data: categories,
    errors: null,
  });
}

module.exports = {
  ListCategoriesResponseSchema,
  buildListCategoriesResponse,
};
