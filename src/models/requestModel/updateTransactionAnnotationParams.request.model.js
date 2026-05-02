const { z } = require("zod");

const UpdateTransactionAnnotationParamsSchema = z.object({
  id: z.string().min(1),
});

module.exports = {
  UpdateTransactionAnnotationParamsSchema,
};
