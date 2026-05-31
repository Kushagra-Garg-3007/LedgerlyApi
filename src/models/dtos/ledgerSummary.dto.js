const { z } = require("zod");

const LedgerSummaryDtoSchema = z.object({
  totalDebit: z.number(),
  totalCredit: z.number(),
  transactionCount: z.number().int(),
  balance: z.number()
});

module.exports = {
  LedgerSummaryDtoSchema,
};
