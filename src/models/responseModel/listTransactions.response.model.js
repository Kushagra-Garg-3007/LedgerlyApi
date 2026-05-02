const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { TransactionDtoSchema } = require("../dtos/transaction.dto");

const ListTransactionsResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(200),
  success: z.literal(true),
  message: z.literal("Transactions fetched"),
  data: z.array(TransactionDtoSchema),
  errors: z.null(),
});

function buildListTransactionsResponse(transactionsDto) {
  return ListTransactionsResponseSchema.parse({
    statusCode: 200,
    success: true,
    message: "Transactions fetched",
    data: transactionsDto,
    errors: null,
  });
}

module.exports = {
  ListTransactionsResponseSchema,
  buildListTransactionsResponse,
};
