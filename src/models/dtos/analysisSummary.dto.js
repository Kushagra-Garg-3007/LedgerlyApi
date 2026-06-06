const { z } = require("zod");

const AnalysisSummaryDtoSchema = z.object({
  totalIncome: z.number(),
  totalExpense: z.number(),
  netSavings: z.number()
});

const ItemDtoSchema = z.object({
  name: z.string(),
  amount: z.number(),
  percentage: z.number()
});

const AnalysisDtoSchema = z.object({
  summary: AnalysisSummaryDtoSchema,
  incomeSources: z.array(ItemDtoSchema),
  expenseCategories: z.array(ItemDtoSchema),
  topMerchants: z.array(ItemDtoSchema)
});

module.exports = {
  AnalysisDtoSchema
};