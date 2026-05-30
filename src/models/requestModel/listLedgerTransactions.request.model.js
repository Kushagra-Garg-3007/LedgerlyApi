const { z } = require("zod");
const { isValidDateOnly, toDateOnly } = require("../../utils/date.utils");

const DateOnlySchema = z
  .string()
  .trim()
  .refine(isValidDateOnly, "Expected a valid date in YYYY-MM-DD format")
  .transform(toDateOnly);

const PositiveIntegerQuerySchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Expected a positive integer")
  .transform((value) => Number(value))
  .refine((value) => value >= 1, "Expected a positive integer");

const ListLedgerTransactionsQuerySchema = z
  .object({
    startDate: DateOnlySchema.optional(),
    endDate: DateOnlySchema.optional(),
    page: PositiveIntegerQuerySchema.optional(),
    limit: PositiveIntegerQuerySchema.refine(
      (value) => value <= 100,
      "Limit must be less than or equal to 100",
    ).optional(),
  })
  .refine(
    (query) => Boolean(query.startDate) === Boolean(query.endDate),
    {
      path: ["endDate"],
      message: "startDate and endDate must be provided together",
    },
  )
  .refine(
    (query) => !query.startDate || query.startDate <= query.endDate,
    {
      path: ["endDate"],
      message: "endDate must be greater than or equal to startDate",
    },
  );

module.exports = {
  ListLedgerTransactionsQuerySchema,
};
