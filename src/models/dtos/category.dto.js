const { z } = require("zod");
const { DtoIdSchema, NullableDtoIdSchema } = require("../../utils/id.utils");

const CategoryDtoSchema = z.object({
  id: DtoIdSchema,
  userId: NullableDtoIdSchema,
  name: z.string().min(1).max(100),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

module.exports = {
  CategoryDtoSchema,
};
