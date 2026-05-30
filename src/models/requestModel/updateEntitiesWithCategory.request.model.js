const { z } = require("zod");

const UpdateEntitiesWithCategorySchema = z.object({
  entityId: z.coerce.bigint(),
  categoryId: z.coerce.bigint(),
  rawTransactionId: z.coerce.bigint().optional(),
  note: z.string().max(500).nullable().optional(),
});

module.exports = {
  UpdateEntitiesWithCategorySchema,
};