const { z } = require("zod");
const { DtoIdSchema, NullableDtoIdSchema } = require("../../utils/id.utils");

const AnnotationDtoSchema = z.object({
  id: DtoIdSchema,
  rawTransactionId: DtoIdSchema,
  userId: DtoIdSchema,
  categoryId: NullableDtoIdSchema,
  entityId: NullableDtoIdSchema,
  note: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

module.exports = {
  AnnotationDtoSchema,
};
