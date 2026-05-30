const { z } = require("zod");
const { IdParamSchema } = require("../../utils/id.utils");

const UpdateTransactionAnnotationParamsSchema = z.object({
  id: IdParamSchema,
});

module.exports = {
  UpdateTransactionAnnotationParamsSchema,
};
