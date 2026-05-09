const { z } = require("zod");

const AssignTransactionCategorySchema = z.object({
  categoryId: z.string().min(1).nullable(),
});

module.exports = {
  AssignTransactionCategorySchema,
};
