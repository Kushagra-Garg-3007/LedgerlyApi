const { z } = require("zod");
const { IdParamSchema } = require("../../utils/id.utils");

const CategoryParamsSchema = z.object({
  id: IdParamSchema,
});

module.exports = {
  CategoryParamsSchema,
};
