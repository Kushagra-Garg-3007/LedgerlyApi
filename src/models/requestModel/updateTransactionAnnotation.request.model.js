const { z } = require("zod");

const UpdateTransactionAnnotationSchema = z.object({
  categoryId: z.string().min(1).nullable().optional(),
  entityId: z.string().min(1).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
});

module.exports = {
  UpdateTransactionAnnotationSchema,
};
