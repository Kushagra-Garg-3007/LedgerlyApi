const { z } = require("zod");

function toBigIntId(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  try {
    return BigInt(value);
  } catch (_error) {
    return null;
  }
}

const NumericIdInputSchema = z.union([z.string().trim().regex(/^\d+$/, "Expected a numeric id"), z.bigint()]);

const IdParamSchema = NumericIdInputSchema.transform((value) => BigInt(value));

const NullableIdSchema = NumericIdInputSchema.transform((value) => BigInt(value)).nullable();

const OptionalNullableIdSchema = NullableIdSchema.optional();

const DtoIdSchema = z
  .union([z.bigint(), z.string(), z.number().int()])
  .transform((value) => value.toString());

const NullableDtoIdSchema = DtoIdSchema.nullable();

module.exports = {
  DtoIdSchema,
  IdParamSchema,
  NullableDtoIdSchema,
  NullableIdSchema,
  OptionalNullableIdSchema,
  toBigIntId,
};
