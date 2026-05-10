const { z } = require("zod");

const LedgerTransactionDtoSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  type: z.enum(["DEBIT", "CREDIT"]),
  creditAmount: z.number().nullable(),
  debitAmount: z.number().nullable(),
  balance: z.number().nullable(),
  entity: z
    .object({
      id: z.string().min(1),
      name: z.string().min(1),
    })
    .nullable(),
  category: z
    .object({
      id: z.string().min(1),
      name: z.string().min(1),
    })
    .nullable(),
  note: z.string().nullable(),
});

module.exports = {
  LedgerTransactionDtoSchema,
};
