const { z } = require("zod");

const UpdateTransactionAnnotationCategorySchema = z
  .object({
    categoryId: z.coerce.bigint(),
    rawTransactionId: z.coerce.bigint(),
    note: z.string().max(500).nullable().optional(),
  })
  .transform((payload) => ({
    ...payload,
    hasNote: Object.prototype.hasOwnProperty.call(payload, "note"),
  }));

module.exports = {
  UpdateTransactionAnnotationCategorySchema,
};
