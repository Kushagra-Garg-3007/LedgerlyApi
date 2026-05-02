const { z } = require("zod");

const TransactionDtoSchema = z.object({
  id: z.string().min(1),
  uploadId: z.string().min(1),
  txnDate: z.coerce.date(),
  description: z.string(),
  amount: z.number(),
  txnType: z.enum(["DEBIT", "CREDIT"]),
  sourceRow: z.number().int(),
  createdAt: z.coerce.date(),
});

module.exports = {
  TransactionDtoSchema,
};
