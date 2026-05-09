const { z } = require("zod");

const CategoryParamsSchema = z.object({
  id: z.string().min(1),
});

module.exports = {
  CategoryParamsSchema,
};
