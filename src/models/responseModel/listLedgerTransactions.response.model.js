const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { LedgerTransactionDtoSchema } = require("../dtos/ledgerTransaction.dto");

const ListLedgerTransactionsResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(200),
  success: z.literal(true),
  message: z.literal("Ledger transactions fetched"),
  data: z.array(LedgerTransactionDtoSchema),
  errors: z.null(),
});

function buildListLedgerTransactionsResponse(transactionsDto) {
  return ListLedgerTransactionsResponseSchema.parse({
    statusCode: 200,
    success: true,
    message: "Ledger transactions fetched",
    data: transactionsDto,
    errors: null,
  });
}

module.exports = {
  ListLedgerTransactionsResponseSchema,
  buildListLedgerTransactionsResponse,
};
