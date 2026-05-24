function buildValidationErrors(zodError) {
  const issues = zodError?.issues || [];
  return issues.map((issue) => ({
    field: issue.path?.join(".") || "unknown",
    message: issue.message,
  }));
}

function throwValidationError(zodError) {
  const error = new Error("Validation failed");
  error.statusCode = 400;
  error.errors = buildValidationErrors(zodError);
  throw error;
}

module.exports = {
  buildValidationErrors,
  throwValidationError,
};
