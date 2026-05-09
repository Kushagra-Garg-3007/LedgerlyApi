const { z } = require("zod");

const CategoryDtoSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1).nullable(),
  name: z.string().min(1).max(100),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

module.exports = {
  CategoryDtoSchema,
};
