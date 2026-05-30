const { z } = require("zod");
const { DtoIdSchema } = require("../../utils/id.utils");

const LedgerTransactionDtoSchema = z.object({
  id: DtoIdSchema,
  date: z.string().min(1),
  type: z.enum(["DEBIT", "CREDIT"]),
  creditAmount: z.number().nullable(),
  debitAmount: z.number().nullable(),
  balance: z.number().nullable(),
  entity: z
    .object({
      id: DtoIdSchema,
      name: z.string().min(1),
    })
    .nullable(),
  category: z
    .object({
      id: DtoIdSchema,
      name: z.string().min(1),
    })
    .nullable(),
  note: z.string().nullable(),
});

module.exports = {
  LedgerTransactionDtoSchema,
};
