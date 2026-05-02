const { z } = require("zod");
const { BaseResponseSchema } = require("./base.response.model");
const { LedgerSummaryDtoSchema } = require("../dtos/ledgerSummary.dto");

const GetLedgerSummaryResponseSchema = BaseResponseSchema.extend({
  statusCode: z.literal(200),
  success: z.literal(true),
  message: z.literal("Ledger summary fetched"),
  data: LedgerSummaryDtoSchema,
  errors: z.null(),
});

function buildGetLedgerSummaryResponse(summaryDto) {
  return GetLedgerSummaryResponseSchema.parse({
    statusCode: 200,
    success: true,
    message: "Ledger summary fetched",
    data: summaryDto,
    errors: null,
  });
}

module.exports = {
  GetLedgerSummaryResponseSchema,
  buildGetLedgerSummaryResponse,
};
