const { z } = require("zod");
const { NullableIdSchema } = require("../../utils/id.utils");

const AssignTransactionCategorySchema = z.object({
  categoryId: NullableIdSchema,
  applyToAll: z.boolean().optional().default(false),
});

module.exports = {
  AssignTransactionCategorySchema,
};
