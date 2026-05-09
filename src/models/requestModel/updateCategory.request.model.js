const { z } = require("zod");

const UpdateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
});

module.exports = {
  UpdateCategorySchema,
};
