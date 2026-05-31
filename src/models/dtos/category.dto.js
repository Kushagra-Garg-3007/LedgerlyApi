const { z } = require("zod");
const { DtoIdSchema, NullableDtoIdSchema } = require("../../utils/id.utils");

const CategoryDtoSchema = z.object({
  id: DtoIdSchema,
  name: z.string().min(1).max(100),
  items: z.number()
});

module.exports = {
  CategoryDtoSchema,
};
