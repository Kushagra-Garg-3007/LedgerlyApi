const comparisonSummaryDtoSchema = z.object({
  current: z.number(),
  previous: z.number(),
  difference: z.number(),
  percentageChange: z.number()
});

const comparisonItemDtoSchema = z.object({
  name: z.string(),
  current: z.number(),
  previous: z.number(),
  difference: z.number(),
  percentageChange: z.number()
});

const comparisonDtoSchema = z.object({
  summary: z.object({
    income: comparisonSummaryDtoSchema,
    expense: comparisonSummaryDtoSchema,
    savings: comparisonSummaryDtoSchema
  }),

  incomeSources: z.array(comparisonItemDtoSchema),

  expenseCategories: z.array(comparisonItemDtoSchema),

  topMerchants: z.array(comparisonItemDtoSchema)
});

module.exports = {
    comparisonDtoSchema
}