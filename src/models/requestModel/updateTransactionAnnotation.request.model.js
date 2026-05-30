const { z } = require("zod");
const { OptionalNullableIdSchema } = require("../../utils/id.utils");

const UpdateTransactionAnnotationSchema = z.object({
  categoryId: OptionalNullableIdSchema,
  entityId: OptionalNullableIdSchema,
  note: z.string().max(500).nullable().optional(),
});

module.exports = {
  UpdateTransactionAnnotationSchema,
};
