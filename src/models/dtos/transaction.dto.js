const { z } = require("zod");
const { DtoIdSchema, NullableDtoIdSchema } = require("../../utils/id.utils");

const TransactionDtoSchema = z.object({
  id: DtoIdSchema,
  uploadId: DtoIdSchema,
  txnDate: z.coerce.date(),
  description: z.string(),
  amount: z.number(),
  balance: z.number().nullable().optional(),
  balanceAfterTxn: z.number(),
  txnType: z.enum(["DEBIT", "CREDIT"]),
  sourceRow: z.number().int(),
  createdAt: z.coerce.date(),
  categoryId: NullableDtoIdSchema.optional(),
  categoryName: z.string().nullable().optional(),
});

module.exports = {
  TransactionDtoSchema,
};
