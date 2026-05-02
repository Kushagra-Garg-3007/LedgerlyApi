const { z } = require("zod");

const AnnotationDtoSchema = z.object({
  id: z.string().min(1),
  rawTransactionId: z.string().min(1),
  userId: z.string().min(1),
  categoryId: z.string().min(1).nullable(),
  entityId: z.string().min(1).nullable(),
  note: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

module.exports = {
  AnnotationDtoSchema,
};
