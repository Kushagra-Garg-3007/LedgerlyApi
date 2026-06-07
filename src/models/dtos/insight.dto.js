const { z } = require("zod");

const InsightItemDtoSchema = z.object({
  name: z.string(),
  txnType: z.enum(["DEBIT", "CREDIT"]),
  currentAverage: z.number(),
  previousAverage: z.number(),
  difference: z.number(),
  percentageChange: z.number().nullable(),
  isNew: z.boolean().default(false),
  isRemoved: z.boolean().default(false)
});

const InsightsSummaryDtoSchema = z.object({
  totalImprovedCategories: z.number(),
  totalAttentionCategories: z.number(),
  totalImprovedIncomeSources: z.number()
});

const InsightsDtoSchema = z.object({
  summary: InsightsSummaryDtoSchema,

  spendingImproved: z.array(InsightItemDtoSchema),

  spendingIncreased: z.array(InsightItemDtoSchema),

  incomeChanges: z.array(InsightItemDtoSchema)
});

module.exports = {
  InsightsDtoSchema
};